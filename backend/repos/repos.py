import os
import shutil
from distutils.dir_util import copy_tree
from distutils.file_util import copy_file
from http import HTTPStatus
from typing import List
from uuid import UUID

from flask import Blueprint, jsonify, abort, send_from_directory, make_response, request, current_app
from flask_login import login_required
from git import Repo

from .file_util import get_directory_contents
from .. import User, DB, ENV, ReviewerPool
from ..db import models
from ..db.api_models import RepoDto
from ..utils.file_utils import recursive_chown
from ..utils.json import check_request_json
from ..utils.session import get_active_user, no_content_response
from ..dbcr import anonymous_filter

repos_bp = Blueprint("repos", __name__, url_prefix="/api/v1.0/repos", static_folder="static")


@repos_bp.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), HTTPStatus.NOT_FOUND)


def get_repo_path(repo_id: UUID) -> str:
    return os.path.sep.join([current_app.config["REPOS_PATH"], repo_id.hex])


# Return tuple of path and filename. Path will not end with a slash
def splitFilePath(path: str):
    last = path.rfind("/")

    if last < 0:
        return "", path

    return path[:last], path[last+1:]


def split_path(path: str):
    return path.split("/")


def flatten_directories(dir_contents):
    flattened = {"directories": []}

    for dir in dir_contents["directories"]:
        flattened["directories"].append(dir)

    flattened["files"] = dir_contents["files"][:]

    return flattened


def get_blacklisted_names(user: User) -> List[str]:
    # TODO - include user names from the same pool
    return [user.username, user.first_name, user.surname]


def init_db_repo_only(repo_name: str, user: User) -> models.Repo:
    if models.Repo.find_by_names(repo_name, user.username):
        current_app.logger.error(f"User {user} already has repo named {repo_name}")
        return None

    repo = models.Repo(name=repo_name, owner_id=user.id)

    if not repo.save():
        current_app.logger.error(f"Failed to save repo {repo_name}")
        return None

    return repo


def init_new_repo(repo_name: str, user: User) -> models.Repo:
    repo = init_db_repo_only(repo_name, user)
    repo_path = get_repo_path(repo.id)

    local_repo = Repo.init(repo_path, mkdir=True)

    if not local_repo:
        current_app.logger.error(f"Failed to create repo locally")
        DB.delete(repo)
        return None

    with local_repo.config_writer() as writer:
        writer.set_value("receive", "denyCurrentBranch", "updateInstead")
        writer.set_value("http", "receivepack", "true")
        writer.release()

    local_repo.close()

    def rollback():
        DB.delete(repo)
        shutil.rmtree(repo_path)

    if ENV == "production":
        try:
            recursive_chown(repo_path, "www-data", "www-data")
        except RuntimeError as err:
            rollback()
            current_app.logger.error("Failed to change " + repo_path + " ownership to www-data")
            current_app.logger.error(err)
            return None

    return repo


def anonymise_repo(repo: models.Repo, user: User):
    if ENV != "production":
        return

    anonymous_filter.anonymise(get_repo_path(repo.id), get_blacklisted_names(user))


def check_push_auth(user: User, repo: models.Repo):
    if repo.owner_id == user.id:
        return no_content_response()

    abort(HTTPStatus.UNAUTHORIZED)


def check_pull_auth(user: User, repo: models.Repo):
    if repo.owner_id == user.id:
        current_app.logger.info("Puller owns repo")
        return no_content_response()

    if repo.is_user_a_contributor(user.id):
        current_app.logger.info("Puller is contributor")
        return no_content_response()

    current_app.logger.info("Puller not relevant, rejecting")
    abort(HTTPStatus.UNAUTHORIZED)


def extract_repo(git_uri: str) -> str:
    first_half = git_uri.split("/.git")[0]
    split = first_half.split("/")
    repo_name = split[len(split) - 1]
    return repo_name


@repos_bp.route("/check_auth", methods=["GET"])
def check_auth():
    original_uri_header = "X-Original-URI"

    if "Username" not in request.headers or original_uri_header not in request.headers:
        current_app.logger.info("Username not passed")
        abort(HTTPStatus.UNAUTHORIZED)

    current_app.logger.info(request)
    # current_app.logger.info(request.headers)

    username = request.headers["Username"]
    original_uri = request.headers[original_uri_header]

    push_service = "git-receive-pack"
    pull_service = "git-upload-pack"

    if push_service in original_uri and pull_service in original_uri:
        abort(HTTPStatus.UNAUTHORIZED)

    repo_id = extract_repo(original_uri)

    repo = models.Repo.query.get(repo_id)

    if not repo:
        current_app.logger.info("Repo not found")
        abort(HTTPStatus.NOT_FOUND)

    user = User.find_by_username(username)

    if not user:
        current_app.logger.info("Username invalid")
        abort(HTTPStatus.UNAUTHORIZED)

    if push_service in original_uri:
        return check_push_auth(user, repo)

    if pull_service in original_uri:
        return check_pull_auth(user, repo)

    current_app.logger.info("Something went wrong")
    abort(HTTPStatus.UNAUTHORIZED)


def get_base_url(blueprint):
    return request.base_url.split(blueprint.url_prefix)[0]


def is_valid_repo_name(repo_name: str):
    return not (repo_name == "" or "\\" in repo_name or "/" in repo_name)


@repos_bp.route("/create", methods=["POST"])
@login_required
def create_repo():
    repo_name, = check_request_json(["repo_name"])

    if not is_valid_repo_name(repo_name):
        abort(HTTPStatus.BAD_REQUEST)

    repo = init_new_repo(repo_name, get_active_user())

    current_app.logger.info(f"Repo created: {repo}")

    if not repo:
        abort(HTTPStatus.INTERNAL_SERVER_ERROR)

    return jsonify(RepoDto.from_db(repo, get_base_url(repos_bp)))


def init_new_repos_for_pool(pool: ReviewerPool, repo_name: str) -> List[str]:
    current_app.logger.info(f"Creating repos for pool {pool.name} from scratch")

    failure_usernames = []
    for member in pool.members.all():
        repo = None
        try:
            repo = init_new_repo(repo_name, member)
        except:
            pass

        if not repo:
            failure_usernames.append(member.username)

    return failure_usernames


def copy_repo_for_pool(base_repo: models.Repo, pool: ReviewerPool) -> List[str]:
    current_app.logger.info(f"Pool owner for {pool.name} has existing repo {base_repo.name}, attempting to copy")
    # Copy all files from base_repo to folders for all the other users
    get_repo_path(base_repo.id)

    failure_usernames = set()
    repos = []

    for member in pool.members.all():
        if member.id == base_repo.owner_id:
            continue

        repo = init_db_repo_only(base_repo.name, member)

        if not repo:
            failure_usernames.add(member.username)
        else:
            repos.append(repo)

    base_repo_path = get_repo_path(base_repo.id)

    for repo in repos:
        path = get_repo_path(repo.id)
        if os.path.exists(path):
            try:
                shutil.rmtree(path)
            except RuntimeError as err:
                current_app.logger.error("Failed to remove existing repo contents while copying repos", err)
                failure_usernames.add(repo.owner.username)
                continue

        try:
            copy_tree(base_repo_path, path)
        except RuntimeError as err:
            current_app.logger.error(f"Failed to copy seed repo files for user {repo.owner.username} ", err)
            failure_usernames.add(repo.owner.username)

    return list(failure_usernames)


@repos_bp.route("/pool_create", methods=["POST"])
@login_required
def create_repos_for_pool():
    repo_name, pool_name = check_request_json(["repo_name", "pool_name"])

    if not is_valid_repo_name(repo_name):
        abort(HTTPStatus.BAD_REQUEST)

    pool = ReviewerPool.find_by_name(pool_name)

    user = get_active_user()

    if not pool or not user.id == pool.owner_id:
        abort(HTTPStatus.UNAUTHORIZED)

    base_repo = models.Repo.find_by_names(repo_name, user.username)

    if not base_repo:
        failure_usernames = init_new_repos_for_pool(pool, repo_name)
    else:
        failure_usernames = copy_repo_for_pool(base_repo, pool)

    return jsonify(failure_usernames)


@repos_bp.route("/view/all", methods=["GET"])
@login_required
def get_repos():
    repos = get_active_user().get_repos()
    return jsonify([RepoDto.from_db(repo, get_base_url(repos_bp)) for repo in repos])


@repos_bp.route("/view/dir/<string:repo_id>/", defaults={"path": ""}, methods=["GET"])
@repos_bp.route("/view/dir/<string:repo_id>/<path:path>", methods=["GET"])
@login_required
def get_repo(repo_id: str, path: str):
    if repo_id == "":
        abort(HTTPStatus.NOT_FOUND)

    # TODO - verify permission to view repo

    contents = get_directory_contents(get_repo_path(UUID(hex=repo_id)) + os.path.sep + path)

    if not contents:
        abort(HTTPStatus.INTERNAL_SERVER_ERROR)

    git_folder = ".git"

    if path == "" and git_folder in contents["directories"]:
        contents["directories"].remove(git_folder)

    return jsonify(contents)


@repos_bp.route("/view/file/<string:repo_id>/<path:path>", methods=["GET"])
@login_required
def get_file(repo_id: str, path: str):
    file_path, file_name = splitFilePath(path)

    full_file_path = get_repo_path(UUID(hex=repo_id)) + os.path.sep + file_path

    # TODO: try and improve performance by leveraging nginx here
    return send_from_directory(full_file_path, file_name)
