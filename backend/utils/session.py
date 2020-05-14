from flask import current_app
from flask_login import current_user

from backend import User


def get_active_user() -> User:
    if isinstance(current_user, User):
        current_app.logger.info("Is user instance")
        return current_user

    current_app.logger.info("Is proxy, returning user instance")
    return current_user._get_current_object()


def no_content_response():
    return '', 204