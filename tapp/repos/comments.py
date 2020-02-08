from tapp.repos.repos import repos_bp
from tapp.dbcr.comments import Comment

comments = {}

@repos_bp.route("/comment/<string:repo_id>/<string:user_id>/<string:comment>/<int:line_number>/<string:parent_id>/<path:file_path>", methods=["POST"])
def post_comment(repo_id: str, user_id: str, comment: str, line_number: int, parent_id: str, file_path: str):
    # comments[repo_id + ":" + file_path] =
    pass