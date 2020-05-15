from flask_login import current_user

from backend import User


def get_active_user() -> User:
    if isinstance(current_user, User):
        return current_user

    return current_user._get_current_object()


def no_content_response():
    return '', 204