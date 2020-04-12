from datetime import datetime

from .database import DB

db = DB.db


reviewers = db.Table("reviewers",
    db.Column("review_id", db.Integer, db.ForeignKey("review.id")),
    db.Column("user_id", db.Integer, db.ForeignKey("user.id"))
)

pool_members = db.Table("pool_members",
    db.Column("reviewer_pool_id", db.Integer, db.ForeignKey("reviewer_pool.id")),
    db.Column("user_id", db.Integer, db.ForeignKey("user.id"))
)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(128))
    firstname = db.Column(db.String(128))
    surname = db.Column(db.String(128))
    reviews = db.relationship("Review", secondary=reviewers, backpopulates="reviewers")
    reviewer_pools = db.relationship("ReviewerPool", secondary=pool_members, backpopulates="members")

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
    reviewers = db.relationship("User", secondary=reviewers, backpopulates="reviews")


class ReviewerPool(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128))
    description = db.Column(db.String(8000))
    members = db.relationship("User", secondary=pool_members, backpopulates="reviewer_pools")


class AnonUser(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    review_id = db.Column(db.Integer, db.ForeignKey("review.id"))
    name = db.Column(db.String(128))
    comments = db.relationship("Comment", backref="author", lazy="dynamic")


class File(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    repo_id = db.Column(db.Integer, db.ForeignKey("repo.id"))
    file_path = db.Column(db.String(4096))


class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    review_id = db.Column(db.Integer, db.ForeignKey("review.id"))
    file_id = db.Column(db.Integer, db.ForeignKey("file.id"))
    parent_id = db.Column(db.Integer, db.ForeignKey("comment.id"))
    author_id = db.Column(db.Integer, db.ForeignKey("anon_user.id"))
    contents = db.Column(db.String(8000))
    line_number = db.Column(db.Integer)
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)

