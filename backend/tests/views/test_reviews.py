from http import HTTPStatus
from typing import List

from backend import ReviewerPool
from ..fixtures import *
from ..utils import status_code
from ...db.api_models import ReviewerPoolSummaryDto
from ...reviews.reviews import reviews_bp
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
    assert ReviewerPool.query.get(data["id"]) is not None


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
