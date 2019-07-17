import os

from flask import render_template, Blueprint, jsonify, request
from flask_login import login_required

bp = Blueprint('home', __name__)

the_todos = [
    {'title': 'House Chores', 'done': False, 'id': '237r523474'},
    {'title': 'Gym', 'done': True, 'id': '384792385dfh278'},
]

@bp.route('/todos')
def todos():
    return jsonify(the_todos)


@bp.route('/add', methods=['POST'])
def add():
    newTodo = {
        'title': request.json,
        'id': bytes.hex(os.urandom(20)),
        'done': False
    }
    the_todos.append(newTodo)
    return jsonify(the_todos)


@bp.route('/check/<todo_id>', methods=['POST'])
def check(todo_id):
    i = next((index for index, d in enumerate(the_todos) if d['id'] == todo_id))
    the_todos[i]['done'] = not the_todos[i]['done']
    return jsonify(the_todos)


@bp.route('/remove/<todo_id>', methods=['POST'])
def remove(todo_id):
    global the_todos
    the_todos = [todo for todo in the_todos if todo['id'] != todo_id]
    return jsonify(the_todos)


@bp.route('/hello')
@login_required
def hello():
    return render_template('hello.html')
