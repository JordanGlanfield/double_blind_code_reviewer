from urllib.parse import urlparse, urljoin

from flask import request, g, Blueprint, jsonify, current_app
from flask_jwt_extended import (
    create_access_token,
    get_jwt_identity,
    jwt_refresh_token_required,
    jwt_required
)
from flask_login import current_user, login_user, logout_user

from backend import LOGIN_MANAGER
from ..db.models import User
from ..utils.json import check_json
from ..utils.session import no_content_response

bp = Blueprint("auth", __name__, url_prefix="/api")


@LOGIN_MANAGER.user_loader
def load_user(user_id):
    return User.query.get(user_id)


@bp.before_request
def get_current_user():
    g.user = current_user


@bp.route("/login", methods=["POST"])
def login():
    if current_user.is_authenticated:
        return no_content_response()

    check_json(["username", "password"])

    username, password = (
        request.json["username"].strip().lower(),
        request.json["password"].strip(),
    )

    if "remember" in request.json:
        remember = request.json["remember"]
    else:
        remember = False

    user = User.query.filter_by(username=username).first()

    if not user or not user.check_password(password):
        return jsonify(error=True), 401

    login_user(user, remember=remember)

    access_token = create_access_token(identity=username)
    response = jsonify(access_token=access_token)
    return response


@bp.route("/logout")
def logout():
    logout_user()
    return no_content_response()


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
