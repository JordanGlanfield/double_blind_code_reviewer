from datetime import date, time
from typing import List

from flask import request, abort
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
# request and throws a HTTP error if not.
def check_json(required_fields: List[str]):
    if not request.json:
        abort(400)

    for field in required_fields:
        if not field in request.json:
            abort(400)