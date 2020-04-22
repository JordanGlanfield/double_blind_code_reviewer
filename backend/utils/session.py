from flask import session

from flask_login import current_user

from backend import User


def get_active_user() -> User:
    return current_user


def no_content_response():
    return '', 204