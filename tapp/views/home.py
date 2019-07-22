import os

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

bp = Blueprint('home', __name__, url_prefix='/api')

the_todos = [
    {'title': 'House Chores', 'done': False, 'id': '237r523474'},
    {'title': 'Gym', 'done': True, 'id': '384792385dfh278'},
]

@bp.route('/todos')
@jwt_required
def todos():
    return jsonify(the_todos)


@bp.route('/add', methods=['POST'])
@jwt_required
def add():
    newTodo = {
        'title': request.json,
        'id': bytes.hex(os.urandom(20)),
        'done': False
    }
    the_todos.append(newTodo)
    return jsonify(the_todos)


@bp.route('/check/<todo_id>', methods=['POST'])
@jwt_required
def check(todo_id):
    i = next((index for index, d in enumerate(the_todos) if d['id'] == todo_id))
    the_todos[i]['done'] = not the_todos[i]['done']
    return jsonify(the_todos)


@bp.route('/remove/<todo_id>', methods=['POST'])
@jwt_required
def remove(todo_id):
    global the_todos
    the_todos = [todo for todo in the_todos if todo['id'] != todo_id]
    return jsonify(the_todos)


@bp.route('/hello')
@jwt_required
def hello():
    current_user = get_jwt_identity()
    return jsonify(current_user)
    # return render_template('hello.html')
