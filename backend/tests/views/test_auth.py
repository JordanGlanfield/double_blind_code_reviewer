from backend import User
from backend.utils import json


def test_can_login(app, db, client):
    password = "password"
    user = User(username="logan")
    user.set_password(password)
    user.save()

    client.post("/api/login",
                data=json.dumps(dict(username=user.username, password=password)),
                content_type="application/json")

    response = client.get("/api/userinfo")

    assert b"logan" in response.data