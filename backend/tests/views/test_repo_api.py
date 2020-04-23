from flask_jwt_extended import create_access_token

from ..fixtures import *


def test_can_login(app, client, test_auth):
    test_auth.login("mr", "logan", "logan")

    with app.app_context():
        access_token = create_access_token("logan")

    headers = {
        'Authorization': 'Bearer {}'.format(access_token)
    }

    response = client.get("/api/userinfo", headers=headers)

    assert b"LOGAN" in response.data


def test_can_add_and_read_comment(client, test_auth):
    test_auth.login("title")
    file = "log.txt"
    comment = "I don't like this"

    client.post(f"/api/v1.0/repos/comment/gson/{file}",
                data=json.dumps({"comment": comment}),
                content_type="application/json")

    response = client.get(f"/api/v1.0/repos/view/comments/gson/log.txt")

    assert comment.encode("UTF-8") in response.data
