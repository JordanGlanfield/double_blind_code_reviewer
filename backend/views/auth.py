from http import HTTPStatus
from urllib.parse import urlparse, urljoin

from flask import request, g, Blueprint, jsonify, current_app, abort
from flask_login import current_user, login_user, logout_user, login_required

from backend import LOGIN_MANAGER, DB
from ..db.api_models import UserDto
from ..db.models import User
from ..utils.json import check_request_json
from ..utils.session import no_content_response, get_active_user

bp = Blueprint("auth", __name__, url_prefix="/api")


PASSWORD_MIN_LENGTH = 8


@LOGIN_MANAGER.user_loader
def load_user(user_id):
    return User.query.get(user_id)


@LOGIN_MANAGER.unauthorized_handler
def unauthorized():
    abort(HTTPStatus.UNAUTHORIZED)

@bp.before_request
def get_current_user():
    g.user = current_user


@bp.route("/signup", methods=["POST"])
def sign_up():
    username, first_name, surname, password = check_request_json(["username", "first_name", "surname", "password"])

    if User.find_by_username(username):
        return "Username is taken", HTTPStatus.CONFLICT

    if len(password) < PASSWORD_MIN_LENGTH:
        return "Password too short", HTTPStatus.NOT_ACCEPTABLE

    if username == "" or first_name == "" or password == "":
        return "Names cannot be empty", HTTPStatus.NOT_ACCEPTABLE

    user = User(username=username, first_name=first_name, surname=surname)
    user.save_with_password(password)

    if current_user.is_authenticated:
        logout_user()

    login_user(user, remember=False)

    return no_content_response()


@bp.route("/login", methods=["POST"])
def login():
    if current_user.is_authenticated:
        abort(HTTPStatus.CONFLICT)

    username, password = check_request_json(["username", "password"])

    if "remember" in request.json:
        remember = request.json["remember"]
    else:
        remember = False

    user = User.query.filter_by(username=username).first()

    if not user or not user.check_password(password):
        abort(HTTPStatus.UNAUTHORIZED)

    login_user(user, remember=remember)

    return jsonify(UserDto.from_db(user))


@bp.route("/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    return no_content_response()


@bp.route("/is_authenticated")
def is_authenticated():
    return jsonify(is_authenticated=current_user.is_authenticated)


@bp.route("/is_admin")
@login_required
def is_admin():
    return jsonify(is_admin=get_active_user().is_admin)


@bp.route("/userinfo")
@login_required
def user_info():
    return jsonify(UserDto.from_db(get_active_user()))


##################################################################
# U T I L I T I E S
##################################################################
def is_safe_url(request_host_url, target):
    ref_url = urlparse(request_host_url)
    test_url = urlparse(urljoin(request_host_url, target))
    return test_url.scheme in ("http", "https") and ref_url.netloc == test_url.netloc
