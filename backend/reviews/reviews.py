from http import HTTPStatus

from flask import Blueprint, jsonify, make_response, request, abort
from flask_login import login_required

from .. import ReviewerPool, DB, User, Repo, Review, File, Comment
from ..db.api_models import ReviewerPoolSummariesDto, ReviewerPoolDto
from ..utils.json import check_request_json
from ..utils.session import get_active_user, no_content_response

reviews_bp = Blueprint("reviews", __name__, url_prefix="/api/v1.0/reviews", static_folder="static")


# TODO: more informative error handling
@reviews_bp.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), HTTPStatus.NOT_FOUND)


# Reviewer pools

@reviews_bp.route("/create/pool", methods=["POST"])
@login_required
def create_pool():
    name, description = check_request_json(["name", "description"])

    if ReviewerPool.find_by_name(name):
        abort(HTTPStatus.CONFLICT)

    active_user = get_active_user()
    pool = ReviewerPool(name=name, description=description, owner_id=active_user.id)

    pool.save()
    DB.db.session.commit()

    return jsonify({"id": pool.id})


@reviews_bp.route("/add/pool/user", methods=["POST"])
@login_required
def add_user_to_pool():
    pool_name, username = check_request_json(["pool_name", "username"])

    reviewer_pool = check_and_get_pool(pool_name)
    check_owner(reviewer_pool)
    user = check_and_get_user(username)

    reviewer_pool.add_user(user)
    DB.db.session.commit()

    return no_content_response()


@reviews_bp.route("/delete/pool/<string:pool_name>/user/<string:username>", methods=["DELETE"])
@login_required
def delete_user_from_pool(pool_name: str, username: str):
    reviewer_pool = check_and_get_pool(pool_name)
    check_owner(reviewer_pool)
    user = check_and_get_user(username)

    if not user in reviewer_pool.members:
        abort(HTTPStatus.NOT_FOUND)

    # Can't remove owner
    if reviewer_pool.owner_id == user.id:
        abort(HTTPStatus.CONFLICT)

    reviewer_pool.remove_user(user)
    DB.db.session.commit()

    return no_content_response()


@reviews_bp.route("/view/pools", methods=["GET"])
@login_required
def get_pools():
    active_user: User = get_active_user()
    reviewer_pools_summary = ReviewerPoolSummariesDto.from_db(active_user.reviewer_pools)
    return jsonify(reviewer_pools_summary)


@reviews_bp.route("/view/pool/<string:pool_name>")
@login_required
def get_pool(pool_name: str):
    reviewer_pool = check_and_get_pool(pool_name)

    if not reviewer_pool.has_user(get_active_user()):
        return make_response(jsonify({"error": "Access Denied"}), HTTPStatus.UNAUTHORIZED)

    return jsonify(ReviewerPoolDto.from_db(reviewer_pool))


# Reviews

# TODO: decide how to use this. Admin functionality only? Users submit their reviews?
@reviews_bp.route("/create/review", methods=["POST"])
@login_required
def start_review():
    username, repo_name = check_request_json(["username", "repo_name"])

    repo = Repo.find_by_names(repo_name, username)
    user = User.find_by_username(username)

    review = Review(repo_id=repo.id, submitter_id=user.id)
    review.save()

    return jsonify({"review_id": review.id})


@reviews_bp.route("/create/comment", methods=["POST"])
@login_required
def add_comment():
    review_id, file_path, parent_id, contents, line_number = \
        check_request_json(["review_id", "file_path", "parent_id", "contents", "line_number"])

    # TODO: check file existence in repo

    review = Review.query.get(review_id)

    if not review:
        abort(HTTPStatus.BAD_REQUEST)

    file = File.find_or_create(review.repo_id, file_path)

    comment = Comment(review_id=review_id, file_id=file.id, parent_id=parent_id, author_id=get_active_user().id,
                      contents=contents, line_number=line_number)
    comment.save()

    return no_content_response()


# Utility functions

def check_and_get_pool(pool_name: str) -> ReviewerPool:
    reviewer_pool: ReviewerPool = ReviewerPool.find_by_name(pool_name)

    if not reviewer_pool:
        abort(HTTPStatus.NOT_FOUND)

    return reviewer_pool


def check_owner(reviewer_pool: ReviewerPool):
    if get_active_user().username != reviewer_pool.owner.username:
        abort(HTTPStatus.UNAUTHORIZED)


def check_and_get_user(username: str):
    user = User.find_by_username(username)

    if not user:
        abort(HTTPStatus.NOT_FOUND)

    return user