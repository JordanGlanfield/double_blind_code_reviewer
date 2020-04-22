from flask import Blueprint, jsonify, make_response, request, abort

from .. import ReviewerPool, DB, User
from ..db.api_models import ReviewerPoolSummariesDto, ReviewerPoolDto
from ..utils.json import check_json
from ..utils.session import get_active_user, no_content_response

reviews_bp = Blueprint("reviews", __name__, url_prefix="/api/v1.0/reviews", static_folder="static")

# TODO: more informative error handling

@reviews_bp.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)


@reviews_bp.route("/create/pool", methods=["POST"])
def create_pool():
    check_json(["name", "description"])

    name: str = request.json["name"]
    description: str = request.json["description"]

    active_user = User.find_by_username(get_active_user())
    pool = ReviewerPool(name=name, description=description, owner_id=active_user.id)

    DB.db.session.add(pool)
    pool.add_user(active_user)
    DB.db.session.commit()

    return jsonify({"id": pool.id})


@reviews_bp.route("/add/pool/user", methods=["POST"])
def add_user_to_pool():
    check_json(["pool_name", "username"])

    pool_name = request.json["pool_name"]
    username = request.json["username"]

    reviewer_pool = check_and_get_pool(pool_name)
    check_owner(reviewer_pool)
    user = check_and_get_user(username)

    reviewer_pool.add_user(user)
    DB.db.session.commit()

    return no_content_response()


@reviews_bp.route("/delete/pool/<string:pool_name>/user/<string:username>", methods=["DELETE"])
def delete_user_from_pool(pool_name: str, username: str):
    reviewer_pool = check_and_get_pool(pool_name)
    check_owner(reviewer_pool)
    user = check_and_get_user(username)

    # Can't remove owner
    if reviewer_pool.owner_id == user.id:
        abort(409) # Conflict

    reviewer_pool.remove_user(user)
    DB.db.session.commit()

    return no_content_response()


@reviews_bp.route("/view/pools", methods=["GET"])
def get_pools():
    active_user: User = User.find_by_username(get_active_user())
    reviewer_pools_summary = ReviewerPoolSummariesDto.from_db(active_user.reviewer_pools)
    return jsonify(reviewer_pools_summary)


@reviews_bp.route("/view/pool/<string:pool_name>")
def get_pool(pool_name: str):
    reviewer_pool = check_and_get_pool(pool_name)

    if not reviewer_pool.has_user(User.find_by_username(get_active_user())):
        return make_response(jsonify({"error": "Access Denied"}), 403)

    return jsonify(ReviewerPoolDto.from_db(reviewer_pool))


def check_and_get_pool(pool_name: str) -> ReviewerPool:
    reviewer_pool: ReviewerPool = ReviewerPool.find_by_name(pool_name)

    if not reviewer_pool:
        abort(404)

    return reviewer_pool


def check_owner(reviewer_pool: ReviewerPool):
    if get_active_user() != reviewer_pool.owner.username:
        abort(403)


def check_and_get_user(username: str):
    user = User.find_by_username(username)

    if not user:
        abort(404)

    return user