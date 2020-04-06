from datetime import date, time

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