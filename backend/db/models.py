from .database import DB

db = DB.db


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(10))
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


class Repo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128))
    owner_id = db.Column(db.Integer, db.ForeignKey("user.id"))


class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    repo_id = db.Column(db.Integer, db.ForeignKey("repo.id"))
    submitter = db.Column(db.integer, db.ForeignKey("user.id"))
    # reviewers
    # pool
    # comments


class File(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    repo_id = db.Column(db.Integer, db.ForeignKey("repo.id"))
    file_path = db.Column(db.String(4096))


class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    review_id = db.Column(db.Integer, db.ForeignKey("review.id"))
    file_id = db.Column(db.Integer, db.ForeignKey("file.id"))
    parent_id = db.Column(db.Integer, db.ForeignKey("comment.id"))
    contents = db.Column(db.String(8000))
    line_number = db.Column(db.Integer)

