from backend import User

from ..fixtures import *

# For testing anything involving the database access, you need to add the db fixture as an
# argument, even if it is not used.


def get_test_user():
    return User(username="johnwick", first_name="John", surname="Wick")


def test_can_create_users(db):
    user = get_test_user()
    user.save()

    assert User.query.filter_by(username="johnwick").first() == user


def test_can_find_by_username(db):
    user = get_test_user()
    user.save()

    assert User.find_by_username(user.username) == user


def test_can_set_password(db):
    password = "banter"
    user = get_test_user()

    user.set_password(password)

    assert user.check_password(password)


def test_wrong_passwords_are_denied(db):
    user = get_test_user()

    user.set_password("banter")

    assert not user.check_password("bento")