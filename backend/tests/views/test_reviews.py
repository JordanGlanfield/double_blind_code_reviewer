from backend import User, ReviewerPool

from ..fixtures import *
from ...utils.json import from_response_json


def test_can_create_reviewer_pool(db, authed_user, api):
    response = api.post("/api/v1.0/reviews/create/pool",
         dict(name="The Best Pool", description="It's really good!"))

    data = from_response_json(response)

    assert "id" in data
    assert ReviewerPool.query.get(data["id"]) is not None

