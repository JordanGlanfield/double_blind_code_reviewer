from flask import session

from flask_login import current_user


def get_active_user():
    return current_user


def no_content_response():
    return '', 204