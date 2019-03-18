from flask import render_template, Blueprint
from flask_login import login_required

bp = Blueprint('home', __name__)


@bp.route('/hello')
@login_required
def hello():
    return render_template('hello.html')
