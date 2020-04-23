from backend import User

from ..fixtures import *


def login() -> User:
    pass


def test_can_create_reviewer_pool(client, authed_user):
    client.post("/api/v1.0/reviews/create/pool", data=dict())