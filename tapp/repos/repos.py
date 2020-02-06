from flask import Blueprint, jsonify, abort, send_from_directory

bp = Blueprint("repos", __name__, url_prefix="/api/v1.0/repos")

repos = {
    "gson": {
        "name": "gson",
        "files": ["log.txt", "test.txt", "oh_no.txt"],
        "directories": {
            "build": {
                "files": ["build_process.md", "build_banter.docx", "build_results.txt"],
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


@bp.route("/view/dir/<string:repo_id>/", defaults={"path": ""}, methods=["GET"])
@bp.route("/view/dir/<string:repo_id>/<path:path>", methods=["GET"])
def get_repo(repo_id: str, path: str):
    if not repo_id in repos:
        abort(404)

    dir_contents = repos[repo_id]

    if not path == "":
        dirs = split_path(path)

        for dir in dirs:

            if not dir in dir_contents["directories"]:
                abort(404)

            dir_contents = dir_contents["directories"][dir]

    return jsonify(flatten_directories(dir_contents))


def flatten_directories(dir_contents):
    flattened = {"directories": []}

    for dir in dir_contents["directories"]:
        flattened["directories"].append(dir)

    flattened["files"] = dir_contents["files"][:]

    return flattened


@bp.route("/view/file/<string:repo_id>/<path:path>", methods=["GET"])
def get_file(repo_id: str, path: str):
    if not repo_id in repos:
        abort(404)

    file = send_from_directory("", "log.txt")
    return file


def split_path(path: str):
    return path.split("/")