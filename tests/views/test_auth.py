from unittest.mock import patch

import ldap
import pytest

from tapp import User


@pytest.mark.parametrize('route', ['/', '/login', '/logout'])
def test_home(test_client, route):
    """
    GIVEN an application client
    WHEN any of the authentication routes is requested (GET)
    THEN the client sends back the login page
    """
    rv = test_client.get(route, follow_redirects=True)
    assert 200 == rv.status_code
    assert b'Username' in rv.data
    assert b'Password' in rv.data


@pytest.mark.parametrize(
    'username, password',
    [
        ('invalid_user', 'invalid_password'),
        ('bdvbuibv', 'lalalalali283794rf56@@'),
        ('', '')
    ]
)
def test_invalid_login(test_client, username, password):
    """
    GIVEN an application client
    WHEN the authentication fails
    THEN the client redirects to the login page with a failure message
    """
    with patch('tapp.auth.auth.login', side_effect=ldap.INVALID_CREDENTIALS, autospec=True):
        rv = test_client.post('/', data=dict(username=username, password=password))
    assert 200 == rv.status_code
    assert b'Login failed' in rv.data
    assert b'invalid combination of login and password' in rv.data


@pytest.mark.parametrize(
    'title, username, password',
    [
        ('Staff', 'prof_usr', 'prof_pwd'),
        ('Student', 'stud_usr', 'stud_pwd'),
        ('PGT', 'pgt_usr', 'pgt_pwd',),
    ]
)
def test_valid_login_adds_user_in_db(test_client, test_db, test_auth, title, username, password):
    """
    GIVEN an application client
    WHEN the authentication succeeds for a new user
    THEN user entry is stored into the database
    """
    rv = test_auth.login(title, username, password)
    assert len(User.query.filter_by(username=username).all()) == 1


def test_valid_login_does_not_add_user_already_in_db(test_client, test_db, test_auth):
    """
    GIVEN an application client
    WHEN the authentication succeeds for an already-seen user
    THEN nothing changes into the database
    """
    test_db.add(User(username='pgt_usr', firstname='PGT_USR', surname=''))
    assert len(User.query.filter_by(username='pgt_usr').all()) == 1

    rv = test_auth.login('PGT', 'pgt_usr', 'a_password')
    assert len(User.query.filter_by(username='pgt_usr').all()) == 1


@pytest.mark.parametrize(
    'route',
    [
        '/hello'
    ]
)
def test_login_required(test_client, route):
    """
    GIVEN an application client
    WHEN a protected route is requested by an anonymous user (GET)
    THEN the client redirects to login page
    """
    rv = test_client.get(route, follow_redirects=True)
    assert b'Login Required' in rv.data
    assert b'need to be logged' in rv.data
    assert b'Username' in rv.data
    assert b'Password' in rv.data

