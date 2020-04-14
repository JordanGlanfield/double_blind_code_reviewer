from flask import Blueprint, jsonify, make_response, request, abort

from .. import ReviewerPool, DB, User, InstrumentedList
from ..db.api_models import ReviewerPoolSummariesDto, ReviewerPoolDto
from ..utils.json import check_json
from ..utils.session import get_active_username, noContentResponse

reviews_bp = Blueprint("reviews", __name__, url_prefix="/api/v1.0/reviews", static_folder="static")

@reviews_bp.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)


@reviews_bp.route("/create/pool", methods=["POST"])
def create_pool():
    check_json(["name", "description"])

    name: str = request.json["name"]
    description: str = request.json["description"]

    active_user = User.find_by_username(get_active_username())
    pool = ReviewerPool(name=name, description=description, owner_id=active_user.id)

    DB.db.session.add(pool)
    pool.add_user(active_user)
    DB.db.session.commit()

    return jsonify({"id": pool.id})


@reviews_bp.route("/add/pool/user", methods=["POST"])
def add_user_to_pool():
    check_json(["id", "username"])

    id = request.json["id"]
    username = request.json["username"]

    reviewer_pool = check_and_get_pool(id)

    if get_active_username() != reviewer_pool.owner.username:
        abort(403)

    reviewer_pool.add_user(username)
    DB.db.session.commit()

    return noContentResponse()

@reviews_bp.route("/view/pools", methods=["GET"])
def get_pools():
    active_user: User = User.find_by_username(get_active_username())
    reviewer_pools_summary = ReviewerPoolSummariesDto.from_db(active_user.reviewer_pools)
    return jsonify(reviewer_pools_summary)


@reviews_bp.route("/view/pool/<string:pool_id>")
def get_pool(pool_id: str):
    reviewer_pool = check_and_get_pool(pool_id)

    if not reviewer_pool.has_user(User.find_by_username(get_active_username())):
        return make_response(jsonify({"error": "Access Denied"}), 403)

    return jsonify(ReviewerPoolDto.from_db(reviewer_pool))


def check_and_get_pool(pool_id: str) -> ReviewerPool:
    reviewer_pool: ReviewerPool = ReviewerPool.query.get(pool_id)

    if not reviewer_pool:
        abort(404)

    return reviewer_pool
