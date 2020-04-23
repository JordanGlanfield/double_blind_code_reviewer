from ..fixtures import *


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


def test_can_add_and_read_comment(client, authed_user):
    file = "log.txt"
    comment = "I don't like this"

    client.post(f"/api/v1.0/repos/comment/gson/{file}",
                data=json.dumps({"comment": comment}),
                content_type="application/json")

    response = client.get(f"/api/v1.0/repos/view/comments/gson/log.txt")

    assert comment.encode("UTF-8") in response.data
