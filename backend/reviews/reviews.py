import random
from http import HTTPStatus
from typing import List, Dict
from uuid import UUID

from flask import Blueprint, jsonify, make_response, request, abort, current_app
from flask_login import login_required

from .. import ReviewerPool, DB, User, Repo, Review, File, Comment, AnonUser
from ..db.api_models import ReviewerPoolSummariesDto, ReviewerPoolDto, CommentListDto, ReviewDto
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

    return jsonify({"id": pool.id.hex})


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

# # TODO: decide how to use this. Admin functionality only? Users submit their reviews?
# @reviews_bp.route("/create/review", methods=["POST"])
# @login_required
# def start_review():
#     username, repo_name = check_request_json(["username", "repo_name"])
#
#     repo = Repo.find_by_names(repo_name, username)
#     user = User.find_by_username(username)
#
#     review = Review(repo_id=repo.id, submitter_id=user.id)
#     review.save()
#
#     return jsonify({"review_id": review.id.hex})


def get_reviewer_assignments(ids: List[UUID], num_reviews: int) -> Dict[UUID, List[UUID]]:
    if num_reviews >= len(ids):
        num_reviews = len(ids) - 1

    ids = list(ids)
    random.shuffle(ids)
    assignments = {id: set({}) for id in ids} # The ids to be reviewed by each reviewer

    for i in range(0, len(ids)):
        reviewer_id = ids[i]

        for j in range(i + 1, i + 1 + num_reviews):
            assignments[reviewer_id].add(ids[j % len(ids)])

    return assignments


@reviews_bp.route("/start", methods=["POST"])
@login_required
def start_reviews():
    pool_name, repo_name = check_request_json(["pool_name", "repo_name"])

    pool = ReviewerPool.find_by_name(pool_name)
    members_by_id = {member.id: member for member in pool.members.all()}

    if not pool:
        abort(HTTPStatus.NOT_FOUND)

    members = [member.id for member in pool.members.all()]
    review_count = 2

    assignments = get_reviewer_assignments(members, review_count)

    error = False

    for reviewer_id in assignments.keys():
        for member_id in assignments[reviewer_id]:
            user = members_by_id[member_id]
            repo = Repo.find_by_names(repo_name, user.username)

            if not user or not repo:
                current_app.logger.error(f"User {user if user else member_id} or Repo {repo if repo else repo_name} "
                                         f"not present")
                error = True
                continue

            review = Review(repo_id=repo.id, submitter_id=member_id)
            review.save()

            anon_user = AnonUser(name="Anonymous", user_id=reviewer_id, review_id=review.id)
            anon_user.save()

    return jsonify({error: error})


@reviews_bp.route("/view/reviews", methods=["GET"])
@login_required
def get_reviews():
    user = get_active_user()
    reviews = User.query.filter_by(id=user.id).join(Review).with_entities(Review).all()

    return jsonify([ReviewDto.from_db(review) for review in reviews])


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

    anon_user = AnonUser.find_or_create(get_active_user().id, review.id)

    if not anon_user:
        # TODO - look at specific error conditions
        abort(HTTPStatus.INTERNAL_SERVER_ERROR)

    comment = Comment(review_id=review_id, file_id=file.id, parent_id=parent_id, author_id=anon_user.id,
                      contents=contents, line_number=line_number)
    comment.save()

    author = comment.author_id

    return no_content_response()


@reviews_bp.route("/view/comments/<string:review_id>/<path:file_path>")
@login_required
def view_comments(review_id: str, file_path: str):
    review = Review.get(review_id)

    if not review:
        abort(HTTPStatus.NOT_FOUND)

    comments = CommentListDto.from_comments_nested(review.get_comments_nested(file_path))

    return jsonify(comments)


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