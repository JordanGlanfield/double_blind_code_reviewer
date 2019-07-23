from .database import DB

db = DB.the_database


class User(db.Model):
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

    def save(self):
        """Save instance to DB"""
        DB.add(self)

    @classmethod
    def find_by_username(cls, username):
        return cls.query.filter_by(username=username).first()

