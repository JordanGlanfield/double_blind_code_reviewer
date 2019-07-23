from urllib.parse import urlparse, urljoin

import ldap
from flask import request, url_for, g, Blueprint, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, set_access_cookies, set_refresh_cookies, \
    get_jwt_identity, jwt_refresh_token_required, unset_jwt_cookies
from flask_login import current_user, logout_user, login_user
from werkzeug.utils import redirect

from tapp import LOGIN_MANAGER
from ..auth import auth
from ..auth import ldap_constants
from ..db.database import DB
from ..db.models import User

bp = Blueprint('auth', __name__)


@LOGIN_MANAGER.user_loader
def load_user(user_id):
    return User.query.get(user_id)


@bp.before_request
def get_current_user():
    g.user = current_user


@bp.route('/login', methods=['POST'])
def login():
    username, password = request.json['username'], request.json['password']
    try:
        attributes = auth.login(username, password)
    except ldap.INVALID_CREDENTIALS:
        return jsonify(error=True), 401
    user = User.query.filter_by(username=username).first()
    if not user:
        user = User(username=username,
                    firstname=attributes.get(ldap_constants.NAME, username.upper()),
                    surname=attributes.get(ldap_constants.SURNAME, ''))
        DB.add(user)

    access_token = create_access_token(identity=username)
    # refresh_token = create_refresh_token(identity=username)
    response = jsonify(access_token=access_token)
    return response


@bp.route('/token/refresh', methods=['POST'])
@jwt_refresh_token_required
def refresh():
    curr_user = get_jwt_identity()
    access_token = create_access_token(identity=curr_user)
    return jsonify(access_token=access_token)


# @bp.route('/login', methods=('GET', 'POST'))
# @bp.route('/', methods=('GET', 'POST'))
# def login():
#     next_pg = request.args.get('next')
#
#     # Redirect to correct home page (according to role)
#     if request.method == 'GET' and current_user.is_authenticated:
#         return redirect(next_pg) if next_pg and is_safe_url(request.host_url, next_pg) else redirect(
#             url_for('home.hello'))
#     form = LoginForm(request.form)
#
#     # Perform login
#     if request.method == 'POST' and form.validate():
#         username, password = request.form.get('username').lower(), request.form.get('password')
#         try:
#             attributes = auth.login(username, password)
#         except ldap.INVALID_CREDENTIALS:
#             flash(messages.LOGIN_UNSUCCESSFUL_ERROR)
#             return render_template('login.html', form=form)
#         user = User.query.filter_by(username=username).first()
#         if not user:
#             user = User(username=username,
#                         firstname=attributes.get(ldap_constants.NAME, username.upper()),
#                         surname=attributes.get(ldap_constants.SURNAME, ''))
#             DB.add(user)
#         login_user(user)
#         return redirect(next_pg) if next_pg and is_safe_url(request.host_url, next_pg) else redirect(
#             url_for('home.hello'))
#
#     if form.errors:
#         flash(messages.LOGIN_UNSUCCESSFUL_ERROR)
#
#     # User not authenticated tries to 'GET' or 'POST' invalid form
#     return render_template('login.html', form=form)

@bp.route('/logout')
def logout():
    resp = jsonify(logged_out=True)
    unset_jwt_cookies(resp)
    return resp


# @bp.route('/logout')
# def logout():
#     logout_user()
#     return redirect(url_for('auth.login'))


##################################################################
# U T I L I T I E S
##################################################################
def is_safe_url(request_host_url, target):
    ref_url = urlparse(request_host_url)
    test_url = urlparse(urljoin(request_host_url, target))
    return test_url.scheme in ('http', 'https') and ref_url.netloc == test_url.netloc
