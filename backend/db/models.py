import uuid
from datetime import datetime
from typing import List, Union

from flask_login import UserMixin
from flask_sqlalchemy import BaseQuery
from sqlalchemy_utils import UUIDType
from sqlalchemy import and_, select
from werkzeug.security import generate_password_hash, check_password_hash

from .database import DB
from ..auth.password_manager import PASSWORD_MANAGER

db = DB.db

reviewers = db.Table("reviewers",
    db.Column("review_id", UUIDType(binary=False), db.ForeignKey("review.id")),
    db.Column("user_id", UUIDType(binary=False), db.ForeignKey("user.id"))
)

pool_members = db.Table("pool_members",
    db.Column("reviewer_pool_id", UUIDType(binary=False), db.ForeignKey("reviewer_pool.id")),
    db.Column("user_id", UUIDType(binary=False), db.ForeignKey("user.id"))
)


class Crud():
    def save(self) -> bool:
        if self.id is None:
            DB.add(self)
            return True
        return False

    def delete(self):
        DB.delete(self)

    @classmethod
    def get(cls, id):
        return cls.query.get(id)

    @classmethod
    def exists(cls, id) -> bool:
        return bool(cls.get(id))


class User(db.Model, UserMixin, Crud):
    id = db.Column(UUIDType(binary=False), primary_key=True, default=uuid.uuid4)
    username = db.Column(db.String(128))
    first_name = db.Column(db.String(128))
    surname = db.Column(db.String(128))
    password_hash = db.Column(db.String(128))
    is_admin = db.Column(db.Boolean, default=False)
    repos = db.relationship("Repo", back_populates="owner", lazy="dynamic")
    anon_users = db.relationship("AnonUser", back_populates="user")
    reviewer_pools = db.relationship("ReviewerPool", secondary=pool_members, back_populates="members")

    def save_with_password(self, password: str) -> bool:
        self.password_hash = generate_password_hash(password)
        if not super().save():
            return False

        if self.id is not None:
            PASSWORD_MANAGER.update_password(self.username, password)
            return True

        return False

    def check_password(self, password: str):
        return check_password_hash(self.password_hash, password)

    def add_repo(self, repo: "Repo"):
        self.repos.append(repo)
        db.session.commit()

    def get_repos(self) -> List["Repo"]:
        return self.repos.all()

    @property
    def is_anonymous(self):
        return False

    @classmethod
    def find_by_username(cls, username):
        return cls.query.filter_by(username=username).first()

    def __repr__(self):
        return '<User {}>'.format(self.username)


class Repo(db.Model, Crud):
    id = db.Column(UUIDType(binary=False), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(128))
    owner_id = db.Column(UUIDType(binary=False), db.ForeignKey("user.id"), nullable=False)
    owner = db.relationship("User", back_populates="repos", uselist=False)

    def _get_anon_users(self) -> BaseQuery:
        return Repo.query.filter_by(id=self.id).join(Review).join(AnonUser).with_entities(AnonUser)

    def get_review_contributors(self) -> List["AnonUser"]:
        return self._get_anon_users().all()

    def is_user_a_contributor(self, user_id: uuid.UUID) -> bool:
        return bool(self._get_anon_users().filter_by(user_id=user_id).first())

    # TODO: test
    @classmethod
    def find_by_names(cls, repo_name: str, owner_name: str):
        return cls.query.filter(and_(Repo.name == repo_name, Repo.owner.has(username=owner_name))).first()


class Comment(db.Model, Crud):
    id = db.Column(UUIDType(binary=False), primary_key=True, default=uuid.uuid4)
    review_id = db.Column(UUIDType(binary=False), db.ForeignKey("review.id"), nullable=False)
    review = db.relationship("Review", back_populates="comments", uselist=False)
    file_id = db.Column(UUIDType(binary=False), db.ForeignKey("file.id"), nullable=False)
    parent_id = db.Column(UUIDType(binary=False), db.ForeignKey("comment.id"), nullable=True)
    parent = db.relationship("Comment", remote_side=[id], backref="replies", uselist=False)
    author_id = db.Column(UUIDType(binary=False), db.ForeignKey("anon_user.id"), nullable=False)
    author = db.relationship("AnonUser", back_populates="comments", uselist=False)
    contents = db.Column(db.String(8000))
    line_number = db.Column(db.Integer)
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)

    # TODO - prevent recursive parental relationships


class Review(db.Model, Crud):
    id = db.Column(UUIDType(binary=False), primary_key=True, default=uuid.uuid4)
    repo_id = db.Column(UUIDType(binary=False), db.ForeignKey("repo.id"), nullable=False)
    submitter_id = db.Column(UUIDType(binary=False), db.ForeignKey("user.id"), nullable=False)
    anon_users = db.relationship("AnonUser", back_populates="review", lazy="dynamic")
    comments = db.relationship("Comment", back_populates="review", lazy="dynamic")

    def save(self) -> bool:
        if not super().save():
            return False

        anon_user = AnonUser(name="Submitter", user_id=self.submitter_id, review_id=self.id)
        anon_user.save()

        self.anon_users.append(anon_user)
        db.session.commit()

    def is_user_in_review(self, user: User):
        for anon in self.anon_users.all():
            if anon.user_id == user.id:
                return True

        return False

    def get_comments_flat(self, file_path: str) -> List[Comment]:
        file = File.find_by_path(self.repo_id, file_path)

        if not file:
            return []

        return self.comments.filter_by(file_id=file.id).all()

    def get_comments_nested(self, file_path: str) -> List[Comment]:
        file = File.find_by_path(self.repo_id, file_path)

        if not file:
            return []

        return self.comments.filter_by(file_id=file.id, parent_id=None).all()


class ReviewerPool(db.Model, Crud):
    id = db.Column(UUIDType(binary=False), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(128))
    description = db.Column(db.String(8000))
    members = db.relationship("User",
                                secondary=pool_members,
                                back_populates="reviewer_pools",
                                lazy="dynamic")
    owner_id = db.Column(UUIDType(binary=False), db.ForeignKey("user.id"), nullable=False)
    owner = db.relationship("User", uselist=False)

    def save(self):
        if not Crud.save(self):
            return False

        self.members.append(self.owner)
        db.session.commit()

        return True

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
    def find_by_name(cls, name) -> "ReviewerPool":
        return cls.query.filter_by(name=name).first()


class AnonUser(db.Model, Crud):
    id = db.Column(UUIDType(binary=False), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(128))
    user_id = db.Column(UUIDType(binary=False), db.ForeignKey("user.id"), nullable=False)
    user = db.relationship("User", back_populates="anon_users")
    review_id = db.Column(UUIDType(binary=False), db.ForeignKey("review.id"), nullable=False)
    review = db.relationship("Review", back_populates="anon_users")
    comments = db.relationship("Comment", back_populates="author", lazy="dynamic")

    @classmethod
    def find_or_create(cls, user_id: str, review_id: str) -> Union[None, "AnonUser"]:
        review = Review.get(review_id)

        if not User.exists(user_id) or not review:
            return None

        anon_user = cls.query.filter_by(user_id=user_id, review_id=review_id).first()

        if not anon_user:
            new_name = f"Anonymous{review.reviewers.count()}"
            anon_user = AnonUser(user_id=user_id, review_id=review_id, name=new_name)
            anon_user.save()

        return anon_user


class File(db.Model, Crud):
    id = db.Column(UUIDType(binary=False), primary_key=True, default=uuid.uuid4)
    repo_id = db.Column(UUIDType(binary=False), db.ForeignKey("repo.id"), nullable=False)
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
