from collections import defaultdict
from http import HTTPStatus
from typing import Dict, List

from flask import Blueprint, jsonify, abort, send_from_directory, make_response, request
from git import Repo

from .file_util import get_directory_contents
from ..dbcr.comments import Comment, CommentDto, comment_to_dto
from ..utils.file_utils import recursive_chown
from ..utils.json import check_json
from ..utils.session import get_active_user, no_content_response

repos_bp = Blueprint("repos", __name__, url_prefix="/api/v1.0/repos", static_folder="static")


@repos_bp.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), HTTPStatus.NOT_FOUND)


# Track repo id and file path. Store mapping from line numbers to chronologically ordered
# comments.

comments: Dict[str, Dict[int, List[Comment]]] = defaultdict(lambda: defaultdict(lambda: []))
comment_id = 0

pseudonym_id = 0

def generate_pseudonym():
    global pseudonym_id
    pseudonym_id += 1
    return "anonymous" + str(pseudonym_id)

pseudonyms: Dict[str, str] = defaultdict(generate_pseudonym)


def get_comment_key(repo_id: str, file_path: str) -> str:
    return str(repo_id) + ":" + file_path


def add_comment(repo_id: str, comment: Comment):
    key = get_comment_key(repo_id, comment.get_file_path())

    global comments
    global comment_id

    comments[key][comment.get_line_number()].append(comment)
    comment_id += 1


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


def init_new_repo(repo_name: str):
    # TODO - not hardcoded path
    repo_path = "./backend/repos/static/" + repo_name
    repo = Repo.init(repo_path, mkdir=True)

    if not repo:
        abort(HTTPStatus.INTERNAL_SERVER_ERROR)

    repo.config_writer().set_value("receive", "denyCurrentBranch", "updateInstead")

    try:
        recursive_chown(repo_path, "www-data", "www-data")
    except:
        print("Failed to change " + repo_path + " ownership to www-data")
        abort(HTTPStatus.INTERNAL_SERVER_ERROR)


@repos_bp.route("/create", methods=["POST"])
def create_repo():
    check_json(["repo_name"])

    repo_name: str = request.json["repo_name"]

    if repo_name == "" or "\\" in repo_name or "/" in repo_name:
        abort(HTTPStatus.BAD_REQUEST)

    init_new_repo(repo_name)

    return no_content_response()


@repos_bp.route("/view/all", methods=["GET"])
def get_repos():
    contents = get_directory_contents("")
    print(contents)
    return jsonify(contents["directories"])


@repos_bp.route("/view/dir/<string:repo_id>/", defaults={"path": ""}, methods=["GET"])
@repos_bp.route("/view/dir/<string:repo_id>/<path:path>", methods=["GET"])
def get_repo(repo_id: str, path: str):
    if repo_id == "":
        abort(HTTPStatus.NOT_FOUND)

    contents = get_directory_contents(repo_id + "/" + path)

    if not contents:
        abort(HTTPStatus.INTERNAL_SERVER_ERROR)

    git_folder = ".git"

    if path == "" and git_folder in contents["directories"]:
        contents["directories"].remove(git_folder)

    return jsonify(contents)


@repos_bp.route("/view/file/<string:repo_id>/<path:path>", methods=["GET"])
def get_file(repo_id: str, path: str):
    file_path, file_name = splitFilePath(path)

    full_file_path = repos_bp.static_folder + "/" + repo_id + "/" + file_path

    return send_from_directory(full_file_path, file_name)


# Comments - TODO extract elsewhere

@repos_bp.route("/view/comments/<string:repo_id>/<path:path>", methods=["GET"])
def get_comments(repo_id: str, path: str):
    key = get_comment_key(repo_id, path)

    if not key in comments:
        return jsonify({})

    comment_dtos: Dict[int, List[CommentDto]] = {}

    for line_number in comments[key].keys():
        comment_dtos[line_number] = [comment_to_dto(comment) for comment in comments[key][line_number]]

    response = jsonify(comment_dtos)
    return response


@repos_bp.route("/comment/<string:repo_id>/<path:file_path>", methods=["POST"])
def post_comment(repo_id: str, file_path):
    check_json(["comment"])

    comment = request.json["comment"]

    if comment == "":
        abort(HTTPStatus.BAD_REQUEST)

    line_number = request.json.get("line_number", 0)
    parent_id = request.json.get("parent_id", -1)

    comment = Comment(comment_id, comment, line_number, file_path, pseudonyms[get_active_user().username], parent_id)
    add_comment(repo_id, comment)

    return jsonify(comment_to_dto(comment))
