from ..fixtures import *


def test_can_add_and_read_comment(client, authed_user):
    file = "log.txt"
    comment = "I don't like this"

    client.post(f"/api/v1.0/repos/comment/gson/{file}",
                data=json.dumps({"comment": comment}),
                content_type="application/json")

    response = client.get(f"/api/v1.0/repos/view/comments/gson/log.txt")

    assert comment.encode("UTF-8") in response.data
