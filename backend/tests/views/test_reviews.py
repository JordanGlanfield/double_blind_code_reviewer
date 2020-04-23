from backend import User


def login() -> User:
    pass


def test_can_create_reviewer_pool(client):
    client.post("/api/v1.0/reviews/create/pool", data=dict())