import json
import os
import tempfile
from unittest.mock import patch

import pytest
from flask_jwt_extended import create_access_token
from flask_login import login_user

from backend import create_app, User
from backend.db.database import DB


@pytest.fixture
def app():
    db_fd, db_path = tempfile.mkstemp()
    app = create_app(
        dict(
            SQLALCHEMY_DATABASE_URI="sqlite:///%s" % db_path,
            SQLALCHEMY_TRACK_MODIFICATIONS=True,
            SECRET_KEY="default_secret_key",
            TESTING=True,
        )
    )

    yield app

    os.close(db_fd)
    os.remove(db_path)


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def db(app):
    with app.app_context():
        DB.create_all()
        try:
            yield DB
        finally:
            DB.db.session.remove()
            DB.drop_all()


class AuthenticationActions:
    """
    Provide convenient authentication shortcuts to enable testing
    of routes for which login is required.
    """

    def __init__(self, client):
        self._client = client

    def login(self, title, username="logan", password="logan"):
        with patch(
            "backend.auth.auth.login",
            return_value={"extensionAttribute6": title},
            autospec=True,
        ):
            return self._client.post(
                "/api/login",
                data=json.dumps(dict(username=username, password=password)),
                follow_redirects=True,
                content_type="application/json"
            )

    def logout(self):
        return self._client.post("/logout")


@pytest.fixture
def test_auth(client):
    return AuthenticationActions(client)


@pytest.fixture
def auth_headers(app, db, client):
    user = User(username="test_user")
    user.set_password("password")
    user.save()

    login_user(user, remember=False)

    with app.app_context():
        access_token = create_access_token(user.username)

    return {
        'Authorization': 'Bearer {}'.format(access_token)
    }
