from flask import Blueprint, jsonify, make_response, request

from .. import ReviewerPool, DB, User
from ..utils.json import check_json
from ..utils.session import get_active_username

reviews_bp = Blueprint("reviews", __name__, url_prefix="/api/v1.0/reviews", static_folder="static")

@reviews_bp.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)


@reviews_bp.route("/create/pool", methods=["POST"])
def create_pool():
    check_json(["name", "description"])

    name: str = request.json["name"]
    description: str = request.json["description"]

    pool = ReviewerPool(name=name, description=description)
    active_user = User.find_by_username(get_active_username())

    DB.db.session.add(pool)
    pool.add_user(active_user)
    DB.db.session.commit()

    return jsonify({"id": pool.id})


@reviews_bp.route("/view/pools", methods=["GET"])
def get_pools():
    print("Banter")
    active_user: User = User.find_by_username(get_active_username())
    pools = []
    for pool in active_user.reviewer_pools:
        pools.append(dict(pool))
    print("Reviewer pools:", active_user.reviewer_pools)
    print("Jsonified reviewer pools:", jsonify(active_user.reviewer_pools))
    return jsonify(active_user.reviewer_pools)