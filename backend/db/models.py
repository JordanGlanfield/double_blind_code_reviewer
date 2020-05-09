from datetime import datetime
from typing import List

from flask_login import UserMixin
from sqlalchemy_utils import UUIDType
from sqlalchemy import and_
from werkzeug.security import generate_password_hash, check_password_hash

from .database import DB
from ..auth.password_manager import PASSWORD_MANAGER

db = DB.db

reviewers = db.Table("reviewers",
    db.Column("review_id", db.Integer, db.ForeignKey("review.id")),
    db.Column("user_id", db.Integer, db.ForeignKey("user.id"))
)

pool_members = db.Table("pool_members",
    db.Column("reviewer_pool_id", db.Integer, db.ForeignKey("reviewer_pool.id")),
    db.Column("user_id", db.Integer, db.ForeignKey("user.id"))
)


class Crud(db.Model):

    def save(self):
        if self.id is None:
            DB.add(self)

    def delete(self):
        DB.delete(self)

    @classmethod
    def get(cls, id):
        return cls.query.get(id)


class User(UserMixin, Crud):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(128))
    first_name = db.Column(db.String(128))
    surname = db.Column(db.String(128))
    password_hash = db.Column(db.String(128))
    reviews = db.relationship("Review", secondary=reviewers, back_populates="reviewers")
    reviewer_pools = db.relationship("ReviewerPool", secondary=pool_members, back_populates="members")

    def save_with_password(self, password: str):
        self.password_hash = generate_password_hash(password)
        super().save()

        if self.id is not None:
            PASSWORD_MANAGER.update_password(self.username, password)

    def check_password(self, password: str):
        return check_password_hash(self.password_hash, password)

    @property
    def is_anonymous(self):
        return False

    @classmethod
    def find_by_username(cls, username):
        return cls.query.filter_by(username=username).first()

    def __repr__(self):
        return '<User {}>'.format(self.username)


class Repo(Crud):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128))
    owner_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    owner = db.relationship("User", uselist=False)

    # TODO: test
    @classmethod
    def find_by_names(cls, repo_name: str, owner_name: str):
        return cls.query.filter(and_(Repo.name == repo_name, Repo.owner.has(username=owner_name))).first()


class Comment(Crud):
    id = db.Column(UUIDType(binary=False), primary_key=True)
    review_id = db.Column(db.Integer, db.ForeignKey("review.id"))
    file_id = db.Column(db.Integer, db.ForeignKey("file.id"))
    parent_id = db.Column(db.Integer, db.ForeignKey("comment.id"), nullable=True)
    parent = db.relationship("Comment", back_populates="replies", uselist=False)
    replies = db.relationship("Comment", back_populates="parent", lazy="dynamic")
    author_id = db.Column(db.Integer, db.ForeignKey("anon_user.id"))
    contents = db.Column(db.String(8000))
    line_number = db.Column(db.Integer)
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)

    # TODO - prevent recursive parental relationships


class Review(Crud):
    id = db.Column(db.Integer, primary_key=True)
    repo_id = db.Column(db.Integer, db.ForeignKey("repo.id"))
    submitter_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    reviewers = db.relationship("User", secondary=reviewers, back_populates="reviews")
    comments = db.relationship("Comment", lazy="dynamic")

    def get_file_comments(self, file_path: str) -> List[Comment]:
        file = File.find_by_path(self.repo_id, file_path)

        if not file:
            return []

        return self.comments.filter_by(file_id=file.id).all()


class ReviewerPool(Crud):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128))
    description = db.Column(db.String(8000))
    members = db.relationship("User",
                                secondary=pool_members,
                                back_populates="reviewer_pools",
                                lazy="dynamic")
    owner_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    owner = db.relationship("User", uselist=False)

    def save(self):
        if User.query.get(self.owner_id) is not None:
            Crud.save(self)
            self.members.append(self.owner)
            db.session.commit()

    def add_user(self, user: User):
        if not self.has_user(user):
            self.members.append(user)

    def remove_user(self, user: User):
        if self.owner_id != user.id and self.has_user(user):
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


class AnonUser(Crud):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    review_id = db.Column(db.Integer, db.ForeignKey("review.id"))
    name = db.Column(db.String(128))
    comments = db.relationship("Comment", backref="author", lazy="dynamic")


class File(Crud):
    id = db.Column(db.Integer, primary_key=True)
    repo_id = db.Column(db.Integer, db.ForeignKey("repo.id"))
    file_path = db.Column(db.String(4096))

    @classmethod
    def find_or_create(cls, repo_id: str, file_path: str):
        file = cls.find_by_path(repo_id, file_path)

        if file:
            return file

        file = File(repo_id=repo_id, file_path=file_path)
        file.save()
        return file

    @classmethod
    def find_by_path(cls, repo_id: str, file_path: str):
        return cls.query.filter_by(repo_id=repo_id, file_path=file_path).first()
