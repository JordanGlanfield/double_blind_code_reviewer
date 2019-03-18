import os
import tempfile
from unittest.mock import patch

import pytest

from tapp import create_app
from tapp.db.database import DB


@pytest.fixture
def test_app():
    db_fd, db_path = tempfile.mkstemp()
    app = create_app(dict(
        SQLALCHEMY_DATABASE_URI='sqlite:///%s' % db_path,
        SQLALCHEMY_TRACK_MODIFICATIONS=True,
        SECRET_KEY='default_secret_key',
        TESTING=True
    ))

    yield app

    os.close(db_fd)
    os.remove(db_path)


@pytest.fixture
def test_client(test_app):
    return test_app.test_client()


@pytest.fixture
def test_db(test_app):
    with test_app.app_context():
        DB.create_all()
        yield DB
        DB.drop_all()


class AuthenticationActions:
    """
    Provide convenient authentication shortcuts to enable testing
    of routes for which login is required.
    """

    def __init__(self, client):
        self._client = client

    def login(self, title, username='test_usr', password='test_passwd'):
        with patch('tapp.auth.auth.login', return_value={'extensionAttribute6': title}, autospec=True):
            return self._client.post('/login', data=dict(username=username, password=password), follow_redirects=True)

    def logout(self):
        return self._client.post('/logout')


@pytest.fixture
def test_auth(test_client):
    return AuthenticationActions(test_client)


