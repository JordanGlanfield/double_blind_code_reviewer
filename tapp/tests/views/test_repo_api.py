from flask_jwt_extended import create_access_token

from ..fixtures import *


def test_can_login(test_app, test_client, test_auth):
    test_auth.login("mr", "logan", "logan")

    with test_app.app_context():
        access_token = create_access_token("logan")

    headers = {
        'Authorization': 'Bearer {}'.format(access_token)
    }

    response = test_client.get("/api/userinfo", headers=headers)

    assert b"LOGAN" in response.data

def test_can_add_and_read_comment(test_client, test_auth):
    test_auth.login("title")
    file = "log.txt"
    comment = "I don't like this"
    line_number = 3

    test_client.post(f"/api/v1.0/repos/comment/gson/{file}/{line_number}/-1/{comment}")

    response = test_client.get(f"/api/v1.0/repos/view/comments/gson/log.txt")

    assert comment.encode("UTF-8") in response.data
