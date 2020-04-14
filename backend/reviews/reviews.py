from flask import Blueprint, jsonify, make_response, request

from .. import ReviewerPool, DB, User
from ..utils.json import check_json
from ..utils.session import get_active_username

reviews_bp = Blueprint("reviews", __name__, url_prefix="/api/v1.0/reviews", static_folder="static")


@reviews_bp.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)


@reviews_bp.route("/create_pool", methods=["POST"])
def create_pool():
    check_json(["name", "description"])

    name: str = request.json["repo_name"]
    description: str = request.json["description"]

    pool = ReviewerPool(name=name, description=description)
    active_user = User.find_by_username(get_active_username())
    pool.add_user(active_user)
    DB.add(pool)

    return jsonify({id: pool.id})