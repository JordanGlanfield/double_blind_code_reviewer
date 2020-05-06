import json
import os
import tempfile
from unittest.mock import patch

import pytest
from flask import Response, Flask
from flask.testing import FlaskClient

from backend import create_app, User
from backend.db.database import DB, Database


@pytest.fixture
def app() -> Flask:
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
def client(app) -> FlaskClient:
    return app.test_client()


@pytest.fixture
def db(app) -> Database:
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

    def login(self, username="logan", password="logan"):
        with patch(
            "backend.auth.auth.login",
            return_value={},
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
def test_auth(client) -> AuthenticationActions:
    return AuthenticationActions(client)


@pytest.fixture
def authed_user(app, db, api) -> User:
    password = "password"
    user = User(username="test_user")
    user.save_with_password(password)

    api.post("/api/login", dict(username=user.username, password=password))

    return user


class ApiActions:
    def __init__(self, client):
        self._client: FlaskClient = client

    def get(self, url: str) -> Response:
        return self._client.get(url)

    def post(self, url: str, dictionary: dict) -> Response:
        return self._client.post(url, data=json.dumps(dictionary), content_type="application/json")

    def delete(self, url: str) -> Response:
        return self._client.delete(url)


@pytest.fixture
def api(client) -> ApiActions:
    return ApiActions(client)
