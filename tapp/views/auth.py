from urllib.parse import urlparse, urljoin

import ldap
from flask import request, g, Blueprint, jsonify, session
from flask_jwt_extended import (
    create_access_token,
    get_jwt_identity,
    jwt_refresh_token_required,
    jwt_required,
)
from flask_login import current_user

from tapp import LOGIN_MANAGER
from ..auth import auth
from ..auth import ldap_constants
from ..db.models import User

bp = Blueprint("auth", __name__, url_prefix="/api")


@LOGIN_MANAGER.user_loader
def load_user(user_id):
    return User.query.get(user_id)


@bp.before_request
def get_current_user():
    g.user = current_user


@bp.route("/login", methods=["POST"])
def login():
    username, password = (
        request.json["username"].strip().lower(),
        request.json["password"].strip(),
    )
    try:
        attributes = auth.login(username, password)
    except ldap.INVALID_CREDENTIALS:
        return jsonify(error=True), 401
    user = User.query.filter_by(username=username).first()
    if not user:
        User(
            username=username,
            firstname=attributes.get(ldap_constants.NAME, username.upper()),
            surname=attributes.get(ldap_constants.SURNAME, ""),
        ).save()
    access_token = create_access_token(identity=username)
    response = jsonify(access_token=access_token)
    session["USERNAME"] = username
    return response


@bp.route("/userinfo")
@jwt_required
def user_info():
    username = get_jwt_identity()
    user = User.find_by_username(username)
    return jsonify(firstname=user.firstname, lastname=user.surname)


@bp.route("/token/refresh", methods=["POST"])
@jwt_refresh_token_required
def refresh():
    curr_user = get_jwt_identity()
    access_token = create_access_token(identity=curr_user)
    return jsonify(access_token=access_token)


##################################################################
# U T I L I T I E S
##################################################################
def is_safe_url(request_host_url, target):
    ref_url = urlparse(request_host_url)
    test_url = urlparse(urljoin(request_host_url, target))
    return test_url.scheme in ("http", "https") and ref_url.netloc == test_url.netloc
