from werkzeug.exceptions import HTTPException

from ..fixtures import *
from ...utils.json import check_json


def test_check_json_aborts_if_json_not_present():
    with pytest.raises(HTTPException):
        check_json(None, [])


def test_check_json_aborts_if_required_field_not_present():
    with pytest.raises(HTTPException):
        check_json({"password": "password"}, ["username"])


def test_check_json_provides_field_values_if_present():
    expected_username = "logan"
    username, = check_json({"username": expected_username}, ["username"])

    assert username == expected_username