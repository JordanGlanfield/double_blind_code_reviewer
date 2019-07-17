from .database import DB

db = DB.the_database


class Representable:

    def __repr__(self):
        return '<' + self.__class__.__name__ + '=> ' + ', '.join(('%s: %s' % (k, v) for k, v in self.__dict__)) + '>'


class User(db.Model, Representable):
    """
    Model for application user.
    Attributes
        username: unique college username (adopted as primary key)
        firstname: college-LDAP name
        surname: college-LDAP surname
    """
    username = db.Column(db.String(10), primary_key=True)
    firstname = db.Column(db.String)
    surname = db.Column(db.String)

    def get_id(self):
        return self.username

    @property
    def is_authenticated(self):
        """Authentication handled by LDAP"""
        return True

    @property
    def is_anonymous(self):
        """Anonymous users not supported"""
        return False

    @property
    def is_active(self):
        """All users are active"""
        return True
