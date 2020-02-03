from flask import Blueprint, jsonify, abort

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


@bp.route("/view/<string:repo_id>/", defaults={"path": ""}, methods=["GET"])
@bp.route("/view/<string:repo_id>/<path:path>", methods=["GET"])
def get_repo(repo_id: str, path: str):
    if not repo_id in repos:
        abort(404)

    dir_contents = repos[repo_id]

    if not path == "":
        dirs = path.split("/")

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