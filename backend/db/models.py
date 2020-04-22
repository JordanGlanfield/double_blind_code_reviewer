from datetime import datetime

from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

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


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(128))
    password_hash = db.Column(db.String(128))
    reviews = db.relationship("Review", secondary=reviewers, back_populates="reviewers")
    reviewer_pools = db.relationship("ReviewerPool", secondary=pool_members, back_populates="members")

    def set_password(self, password: str):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str):
        return check_password_hash(self.password_hash, password)

    def save(self):
        """Save instance to DB"""
        DB.add(self)

    @property
    def get_id(self):
        return self.id

    @property
    def is_anonymous(self):
        return False

    @classmethod
    def find_by_username(cls, username):
        return cls.query.filter_by(username=username).first()

    def __repr__(self):
        return '<User {}>'.format(self.username)


class Repo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128))
    owner_id = db.Column(db.Integer, db.ForeignKey("user.id"))


class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    repo_id = db.Column(db.Integer, db.ForeignKey("repo.id"))
    submitter = db.Column(db.Integer, db.ForeignKey("user.id"))
    reviewers = db.relationship("User", secondary=reviewers, back_populates="reviews")


class ReviewerPool(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128))
    description = db.Column(db.String(8000))
    members = db.relationship("User",
                                secondary=pool_members,
                                back_populates="reviewer_pools",
                                lazy="dynamic")
    owner_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    owner = db.relationship("User", uselist=False)


    def add_user(self, user: User):
        if not self.has_user(user):
            self.members.append(user)

    def remove_user(self, user: User):
        if self.has_user(user):
            self.members.remove(user)

    def has_user(self, user: User):
        return self.members.filter(pool_members.c.user_id == user.id).count() > 0

    def get_members(self):
        return (User.query
                .join(pool_members, (pool_members.c.user_id == User.id))
                .filter(pool_members.c.reviewer_pool_id == ReviewerPool.id))

    @classmethod
    def find_by_name(cls, name):
        return cls.query.filter_by(name=name).first()


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

