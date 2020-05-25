import random
from http import HTTPStatus
from typing import List, Dict
from uuid import UUID

from flask import Blueprint, jsonify, make_response, abort, current_app, request
from flask_login import login_required

from .. import ReviewerPool, DB, User, Repo, Review, File, Comment, AnonUser, ReviewFeedback, AnonymisationFeedback
from ..db.api_models import ReviewerPoolSummariesDto, ReviewerPoolDto, CommentListDto, ReviewDto, RepoDto, \
    ReviewListDto, UserDto
from ..repos.repos import get_base_url, anonymise_repo
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


@reviews_bp.route("/view/users/related", methods=["GET"])
@login_required
def get_related_users():
    user = get_active_user()
    return jsonify([UserDto.from_db(related_user) for related_user in user.get_related_users()])

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
    members: List[User] = pool.members.all()
    members_by_id = {member.id: member for member in members}

    if not pool:
        abort(HTTPStatus.NOT_FOUND)

    members_ids = [member.id for member in members]
    review_count = 2

    assignments = get_reviewer_assignments(members_ids, review_count)

    error = False

    repos = {}

    for member in members:
        repo = Repo.find_by_names(repo_name, member.username)

        if repo:
            try:
                anonymise_repo(repo, repo.owner)
            except RuntimeError as err:
                current_app.logger.error(f"Failed to anonymise repo {repo_name} for {member.username}:")
                current_app.logger.error(err)

            repos[member.id] = repo

    for reviewer_id in assignments.keys():
        for member_id in assignments[reviewer_id]:
            user = members_by_id[member_id]
            repo = repos[member_id]

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


@reviews_bp.route("/is/reviewer/<string:review_id>", methods=["GET"])
@login_required
def is_reviewer(review_id: str):
    user = get_active_user()

    review = Review.get(review_id)

    if not review:
        abort(HTTPStatus.NOT_FOUND)

    return jsonify(is_reviewer=review.is_user_in_review(user) and not review.is_submitter(user.id))


@reviews_bp.route("/view/reviews", methods=["GET"])
@login_required
def get_reviews():
    user = get_active_user()
    reviews = user.get_reviews()

    return jsonify(ReviewListDto.from_db(reviews, get_base_url(reviews_bp)))


@reviews_bp.route("/complete/review/<string:review_id>", methods=["POST"])
@login_required
def complete_review(review_id: str):
    review = Review.get(review_id)

    if not review:
        abort(HTTPStatus.NOT_FOUND)

    # if review.comments.count() == 0:
    #     abort(make_response(jsonify(error="Review must have at least 1 comment"), HTTPStatus.BAD_REQUEST))

    review.complete_review()
    return no_content_response()


@reviews_bp.route("/is/complete/<string:review_id>", methods=["GET"])
@login_required
def is_review_completed(review_id: str):
    review = Review.get(review_id)

    if not review:
        abort(HTTPStatus.NOT_FOUND)

    if not review.is_user_in_review(get_active_user()):
        abort(HTTPStatus.UNAUTHORIZED)

    return jsonify({"is_complete": review.is_completed})


def get_anonymisation_feedback(review_id: str, sureness: int, guess_username: str, reason: str, is_reviewer: bool) \
        -> AnonymisationFeedback:
    guessed_user = User.find_by_username(guess_username)
    guess_id = guessed_user.id if guessed_user else None

    if guess_id == get_active_user().id:
        raise RuntimeError("User cannot guess themself")

    return AnonymisationFeedback(review_id=review_id, sureness=sureness, user_id=get_active_user().id, guess_id=guess_id,
                                                   reason=reason, is_reviewer=is_reviewer)


@reviews_bp.route("/feedback/<string:review_id>", methods=["POST"])
@login_required
def submit_feedback(review_id: str):
    constructiveness, specificity, justification, politeness = \
        check_request_json(["constructiveness", "specificity", "justification", "politeness"])

    feedback, sureness, guess_username, reason = check_request_json(["feedback", "sureness",
                                                                     "guess_username", "reason"])

    review = Review.get(review_id)

    if not review:
        abort(make_response(jsonify({"error": "No such review exists"}), HTTPStatus.NOT_FOUND))

    review_feedback = ReviewFeedback(review_id=review_id, constructiveness=constructiveness, specificity=specificity,
                                     justification=justification, politeness=politeness, feedback=feedback)

    try:
        anonymisation_feedback = get_anonymisation_feedback(review_id, sureness, guess_username, reason, False)

        if not review_feedback.save():
            raise RuntimeError("Failed to save review feedback")

        if not anonymisation_feedback.save():
            review_feedback.delete()
            raise RuntimeError("Failed to save anonymisation feedback")
    except RuntimeError as err:
        current_app.logger.error(err)
        abort(make_response(jsonify({"error": "Failed to save feedback"}), HTTPStatus.BAD_REQUEST))


    return no_content_response()


@reviews_bp.route("/is/feedback/complete/<string:review_id>", methods=["GET"])
@login_required
def is_feedback_complete(review_id: str):
    review = Review.get(review_id)

    if not review:
        abort(HTTPStatus.NOT_FOUND)

    user = get_active_user()

    if not review.is_user_in_review(user):
        abort(HTTPStatus.UNAUTHORIZED)

    feedback = ReviewFeedback.query.filter_by(review_id=review_id).first()

    return jsonify({"is_complete": bool(feedback)})


@reviews_bp.route("/anon/feedback/<string:review_id>", methods=["POST"])
@login_required
def submit_reviewer_anonymisation_feedback(review_id: str):
    sureness, guess_username, reason = check_request_json(["sureness", "guess_username", "reason"])

    if AnonymisationFeedback.find_by_user_and_review(get_active_user().id, review_id):
        abort(HTTPStatus.CONFLICT)

    try:
        anonymisation_feedback = get_anonymisation_feedback(review_id, sureness, guess_username, reason, True)
        if not anonymisation_feedback.save():
            raise RuntimeError("Failed to save anonymisation feedback")
    except Exception as err:
        current_app.logger.error(err)
        abort(make_response(jsonify({"error": str(err)}), HTTPStatus.BAD_REQUEST))

    return no_content_response()


@reviews_bp.route("/view/received", methods=["GET"])
@login_required
def get_reviews_received():
    user = get_active_user()
    reviews = user.get_reviews_received()

    return jsonify(ReviewListDto.from_db(reviews, get_base_url(reviews_bp)))


@reviews_bp.route("/view/repo/<string:review_id>/<path:path>", defaults={"path": ""}, methods=["GET"])
@login_required
def get_repo_summary(review_id: str, path: str):
    user = get_active_user()

    review: Review = Review.get(review_id)

    if not review:
        abort(HTTPStatus.NOT_FOUND)

    if not review.is_user_in_review(user):
        abort(HTTPStatus.UNAUTHORIZED)

    repo = Repo.get(review.repo_id)

    # return repos.get_repo(review.repo_id, path)
    return RepoDto.from_db(repo, get_base_url(reviews_bp))


@reviews_bp.route("/create/comment", methods=["POST"])
@login_required
def add_comment():
    review_id, file_path, contents, line_number = \
        check_request_json(["review_id", "file_path", "contents", "line_number"])

    parent_id = None

    if "parent_id" in request.json:
        parent_id = request.json["parent_id"]

    # TODO: check file existence in repo

    review = Review.query.get(review_id)

    if not review:
        abort(HTTPStatus.BAD_REQUEST)

    user = get_active_user()

    if not review.is_user_in_review(user):
        abort(HTTPStatus.UNAUTHORIZED)

    file = File.find_or_create(review.repo_id, file_path)

    anon_user = AnonUser.find_or_create(user.id, review.id)

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

    if not review.is_user_in_review(get_active_user()):
        abort(HTTPStatus.UNAUTHORIZED)

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