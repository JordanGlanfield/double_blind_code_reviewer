from collections import defaultdict
from typing import Dict, List

from flask import Blueprint, jsonify, abort, send_from_directory, session, make_response, request

from ..dbcr.comments import Comment, CommentDto, comment_to_dto

repos_bp = Blueprint("repos", __name__, url_prefix="/api/v1.0/repos", static_folder="static")


@repos_bp.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)


repos = {
    "gson": {
        "name": "gson",
        "files": ["log.txt", "test.txt", "oh_no.txt"],
        "directories": {
            "build": {
                "files": ["build_process.yaml", "build_banter.docx", "build_results.txt"],
                "directories": {
                    "issues": {
                        "files": ["broken_pipeline.txt", "errors.txt"],
                        "directories": []
                    }
                }
            }
        }
    }
}

# Track repo id and file path. Store mapping from line numbers to chronologically ordered
# comments.

comments: Dict[str, Dict[int, List[Comment]]] = defaultdict(lambda: defaultdict(lambda: []))
comment_id = 0
no_content = '', 204

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


def check_repo(repo_id: str):
    if not repo_id in repos:
        abort(404)


def check_json(required_fields: List[str]):
    if not request.json:
        abort(400)

    for field in required_fields:
        if not field in request.json:
            abort(400)


@repos_bp.route("/banter/<string:name>")
def reply(name):
    return "The banter is with you" + name

@repos_bp.route("/view/dir/<string:repo_id>/", defaults={"path": ""}, methods=["GET"])
@repos_bp.route("/view/dir/<string:repo_id>/<path:path>", methods=["GET"])
def get_repo(repo_id: str, path: str):
    check_repo(repo_id)

    dir_contents = repos[repo_id]

    if not path == "":
        dirs = split_path(path)

        for dir in dirs:

            if not dir in dir_contents["directories"]:
                abort(404)

            dir_contents = dir_contents["directories"][dir]

    return jsonify(flatten_directories(dir_contents))


@repos_bp.route("/view/file/<string:repo_id>/<path:path>", methods=["GET"])
def get_file(repo_id: str, path: str):
    check_repo(repo_id)

    file_path, file_name = splitFilePath(path)

    full_file_path = repos_bp.static_folder + "/" + repo_id + "/" + file_path

    return send_from_directory(full_file_path, file_name)


# Comments - TODO extract elsewhere

@repos_bp.route("/view/comments/<string:repo_id>/<path:path>", methods=["GET"])
def get_comments(repo_id: str, path: str):
    check_repo(repo_id)

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
    check_repo(repo_id)
    check_json(["comment"])

    comment = request.json["comment"]
    line_number = request.json.get("line_number", 0)
    parent_id = request.json.get("parent_id", -1)

    comment = Comment(comment_id, comment, line_number, file_path, get_active_user_id(), parent_id)
    add_comment(repo_id, comment)

    return jsonify(comment_to_dto(comment))


# TODO - lookup in DB rather than assume USERNAME = user_id
def get_active_user_id():
    return session["USERNAME"]