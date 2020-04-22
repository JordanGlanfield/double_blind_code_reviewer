from http import HTTPStatus
from urllib.parse import urlparse, urljoin

from flask import request, g, Blueprint, jsonify, current_app, abort
from flask_jwt_extended import (
    create_access_token,
    get_jwt_identity,
    jwt_refresh_token_required,
    jwt_required,
    jwt_optional, verify_jwt_in_request_optional)
from flask_login import current_user, login_user, logout_user

from backend import LOGIN_MANAGER, DB
from ..db.models import User
from ..utils.json import check_json
from ..utils.session import no_content_response

bp = Blueprint("auth", __name__, url_prefix="/api")


PASSWORD_MIN_LENGTH = 8


@LOGIN_MANAGER.user_loader
def load_user(user_id):
    return User.query.get(user_id)


@bp.before_request
def get_current_user():
    g.user = current_user


@bp.route("/signup", methods=["POST"])
def sign_up():
    check_json(["username", "first_name", "surname", "password"])

    username: str = request.json["username"]
    first_name: str = request.json["first_name"]
    surname: str = request.json["surname"]
    password: str = request.json["password"]


    if User.find_by_username(username):
        return "Username is taken", HTTPStatus.CONFLICT


    if len(password) < PASSWORD_MIN_LENGTH:
        return "Password too short", HTTPStatus.NOT_ACCEPTABLE

    if username == "" or first_name == "" or password == "":
        return "Names cannot be empty", HTTPStatus.NOT_ACCEPTABLE

    user = User(username=username, first_name=first_name, surname=surname)
    user.set_password(password)
    DB.add(user)

    login_user(user, remember=False)

    return no_content_response()


@bp.route("/login", methods=["POST"])
def login():
    try:
        if verify_jwt_in_request_optional():
            abort(HTTPStatus.CONFLICT)
    except Exception:
        pass

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
        abort(HTTPStatus.UNAUTHORIZED)

    login_user(user, remember=remember)

    access_token = create_access_token(identity=username)
    response = jsonify(access_token=access_token)
    return response


@bp.route("/logout")
@jwt_required
def logout():
    logout_user()
    return no_content_response()


@bp.route("/is_authenticated")
def is_authenticated():
    try:
        if verify_jwt_in_request_optional():
            return jsonify(is_authenticated=True)
    except Exception:
        pass
    return jsonify(is_authenticated=False)


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
