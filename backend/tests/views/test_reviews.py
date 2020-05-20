import random
from http import HTTPStatus
from typing import List
from uuid import uuid4

from backend import ReviewerPool, Repo, Review, File, Comment, AnonUser
from ..fixtures import *
from ..utils import status_code
from ...db.api_models import ReviewerPoolSummaryDto
from ...reviews.reviews import reviews_bp, get_reviewer_assignments
from ...utils.json import from_response_json


def get_url(url_suffix: str) -> str:
    return reviews_bp.url_prefix + url_suffix


def add_reviewer_pool(owner: User, name: str = "Testing Pool") -> ReviewerPool:
    reviewer_pool = ReviewerPool(name=name, description="It's a pool for testing", owner_id=owner.id)
    reviewer_pool.save()
    assert reviewer_pool.owner == owner

    return reviewer_pool


def add_user():
    user = User(username="jerry")
    user.save()

    return user


def test_can_create_reviewer_pool(db, authed_user, api):
    response = api.post(get_url("/create/pool"),
         dict(name="The Best Pool", description="It's really good!"))

    data = from_response_json(response)

    assert "id" in data
    id = data["id"]
    assert ReviewerPool.query.get(id) is not None


def test_can_add_user_to_pool(db, authed_user, api):
    name = "Testing Pool"
    user = add_user()
    reviewer_pool = add_reviewer_pool(authed_user, name)

    api.post(get_url("/add/pool/user"), dict(pool_name=name, username=user.username))

    assert user in reviewer_pool.members


def test_cannot_add_non_existent_user_to_pool(db, authed_user, api):
    name = "Testing Pool"
    add_reviewer_pool(authed_user, name)

    response = api.post(get_url("/add/pool/user"), dict(pool_name=name, username="Non-Existant!"))

    assert status_code(response, HTTPStatus.NOT_FOUND)


def test_must_be_owner_to_add_to_pool(db, authed_user, api):
    user = add_user()
    reviewer_pool = add_reviewer_pool(user)

    response = api.post(get_url("/add/pool/user"), dict(pool_name=reviewer_pool.name, username=authed_user.username))

    assert status_code(response, HTTPStatus.UNAUTHORIZED)


def delete_user(api: ApiActions, reviewer_pool: ReviewerPool, user: User) -> Response:
    response = api.delete(get_url(f"/delete/pool/{reviewer_pool.name}/user/{user.username}"))
    return response


def test_can_delete_user_from_pool(db, authed_user, api):
    reviewer_pool = add_reviewer_pool(authed_user)
    user = add_user()
    reviewer_pool.add_user(user)
    db.db.session.commit()

    delete_user(api, reviewer_pool, user)

    assert not user in reviewer_pool.members


def test_cannot_delete_non_members(db, authed_user, api):
    reviewer_pool = add_reviewer_pool(authed_user)
    user = add_user()

    response = delete_user(api, reviewer_pool, user)

    assert status_code(response, HTTPStatus.NOT_FOUND)


def test_can_get_pool(db, authed_user, api):
    name = "Excellent Name"
    add_reviewer_pool(authed_user, name=name)

    response = api.get(get_url(f"/view/pool/{name}"))

    reviewer_pool_dto: dict = from_response_json(response)

    assert reviewer_pool_dto["name"] == name
    assert reviewer_pool_dto["owner"]["username"] == authed_user.username
    assert reviewer_pool_dto["members"][0]["username"] == authed_user.username


def test_can_get_pools(db, authed_user, api):
    reviewer_pool = add_reviewer_pool(authed_user)
    review_pool_2 = add_reviewer_pool(authed_user, "A Different Pool")

    response = api.get(get_url("/view/pools"))

    summary_dtos: List[ReviewerPoolSummaryDto] = from_response_json(response)

    assert len(summary_dtos) == 2


def create_review(authed_user):
    repo = Repo(name="test_repo", owner_id=authed_user.id)
    repo.save()

    review = Review(repo_id=repo.id, submitter_id=authed_user.id)
    review.save()

    return review


# def test_can_start_a_review(db, authed_user, api):
#     repo = Repo(name="test_repo", owner_id=authed_user.id)
#     repo.save()
#
#     response = api.post(get_url(f"/create/review"), dict(username=authed_user.username, repo_name=repo.name))
#
#     review_id = from_response_json(response)["review_id"]
#
#     review = Review.query.get(review_id)
#
#     assert review
#     assert review.repo_id == repo.id
#     assert review.submitter_id == authed_user.id


def test_can_leave_a_comment_during_a_review(db, authed_user, api):
    review = create_review(authed_user)

    contents = "Test comment"
    file_path = "/test/path/file"

    api.post(get_url(f"/create/comment"), dict(review_id=review.id.hex, file_path=file_path,
                                               parent_id=None, contents=contents, line_number=10))

    comments = review.comments.all()

    assert len(comments) == 1
    assert comments[0].contents == contents
    assert comments[0].file_id == File.find_by_path(review.repo_id, file_path).id


def test_can_view_comments(db, authed_user, api):
    review = create_review(authed_user)

    file_path = "test/file/path"
    file = File.find_or_create(review.repo_id, file_path)

    author: AnonUser = authed_user.anon_users[0]

    comments = [Comment(review_id=review.id, file_id=file.id, author_id=author.id, line_number=i, contents=f"Comment{i}")
                for i in range(0, 4)]

    for comment in comments:
        comment.save()

    response = api.get(get_url(f"/view/comments/{review.id}/{file_path}"))
    comment_dtos = from_response_json(response)

    assert len(comment_dtos) == len(comments)

    for i in range(0, len(comment_dtos)):
        assert comment_dtos[i]["contents"] == comments[i].contents


def test_can_assign_reviewers(db, authed_user):
    random.seed(0)
    for _ in range(0, 10):
        uuids = [uuid4() for i in range(0, 10)]

        expected_review_count = 3
        assignments = get_reviewer_assignments(uuids, expected_review_count)

        # All assigned
        assert len(assignments) == len(uuids)

        # All giving two reviews and no one reviewing self
        for reviewer in assignments.keys():
            assert len(assignments[reviewer]) == expected_review_count
            assert not reviewer in assignments[reviewer]

        reviewed = {uuid: 0 for uuid in uuids}

        for reviewing in assignments.values():
            for uuid in reviewing:
                reviewed[uuid] += 1

        # All receiving two reviews
        for review_count in reviewed.values():
            assert review_count == expected_review_count


def test_can_only_complete_a_review_with_comments(db, authed_user, api):
    repo = Repo(name="Test Repo", owner_id=authed_user.id)
    repo.save()

    review = Review(repo_id=repo.id, submitter_id=authed_user.id)
    review.save()

    user = add_user()

    anon_user = AnonUser.find_or_create(user.id, review.id)

    api.post(get_url(f"/complete/review/{review.id}"), {})

    assert not review.is_completed

    Comment(review_id=review.id, contents="Test comment", line_number=0, author_id=anon_user.id).save()

    api.post(get_url(f"/complete/review/{review.id}"), {})

    assert review.is_completed
