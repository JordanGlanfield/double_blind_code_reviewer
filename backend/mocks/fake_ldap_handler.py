import ldap

from ..db.database import DB
from ..db.models import *
from ..utils import file_utils


class FakeLdapConnectionHandler:
    def __init__(self, *_):
        pass

    def init_app(self, *_):
        pass

    def write_test_users(self):
        test_users: {} = file_utils.read_json_file("backend/mocks/fake_ldap_base/users.json")
        for username in test_users:
            if not User.query.filter_by(username=username).first():
                User(username=username).save()

    @staticmethod
    def ldap_login(username, *args, **kwargs):
        if not User.query.filter_by(username=username).first():
            raise ldap.INVALID_CREDENTIALS
        print("[LDAP] Logging in as '%s'" % username)
        return ()

FAKE_LDAP = FakeLdapConnectionHandler()
