from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from tapp import User

bp = Blueprint("home", __name__, url_prefix="/api")


@bp.route("/userinfo")
@jwt_required
def user_info():
    username = get_jwt_identity()
    user = User.find_by_username(username)
    return jsonify(firstname=user.firstname)
