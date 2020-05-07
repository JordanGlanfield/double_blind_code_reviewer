import json
from datetime import date, time
from typing import List, Tuple

from flask import request, abort, Response, Request
from flask.json import JSONEncoder


class ObjectJsonEncoder(JSONEncoder):
    def default(self, obj):
        """JSON serializer for objects not serializable by default json code"""

        if isinstance(obj, date):
            serial = obj.isoformat()
            return serial

        if isinstance(obj, time):
            serial = obj.isoformat()
            return serial

        return obj.__dict__


# Used in the context of a request. Checks that the required fields are present in the
# request and throws a HTTP error if not. Returns the values of the fields in the same order
# they are passed.
def check_request_json(required_fields: List[str]) -> Tuple[str, ...]:
    return check_json(request.json, required_fields)


def check_json(json: dict, required_fields: List[str]) -> Tuple[str, ...]:
    if not json:
        abort(400)

    field_values = []

    for field in required_fields:
        if field not in json:
            abort(400)
        field_values.append(json[field])

    return tuple(field_values)


def from_response_json(response: Response) -> dict:
    return json.loads(response.get_data(as_text=True))
