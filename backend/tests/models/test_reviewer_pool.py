from backend import ReviewerPool

from ..fixtures import *


def get_test_pool(db) -> (ReviewerPool, User):
    owner = User(username="johnwick")
    owner.save()

    reviewer_pool = ReviewerPool(name="The Best Pool", description="The Best Pool!", owner_id=owner.id)
    reviewer_pool.save()

    return reviewer_pool, owner


def test_can_create_reviewer_pool(db):
    (reviewer_pool, owner) = get_test_pool(db)

    assert ReviewerPool.query.filter_by(name=reviewer_pool.name).first() == reviewer_pool
    assert reviewer_pool.owner == owner


def test_owner_is_in_pool_initially(db):
    (reviewer_pool, owner) = get_test_pool(db)

    assert reviewer_pool.has_user(owner)


def test_cannot_save_pool_without_owner(db):
    name = "Testing Pool"
    reviewer_pool = ReviewerPool(name=name, description="Well good")

    with pytest.raises(Exception):
        reviewer_pool.save()

    db.db.session.rollback()

    assert not ReviewerPool.find_by_name(name)


def test_can_find_reviewer_pool_by_name(db):
    (reviewer_pool, _) = get_test_pool(db)

    assert ReviewerPool.find_by_name(reviewer_pool.name) == reviewer_pool


def test_can_add_users_to_pool(db):
    (reviewer_pool, _) = get_test_pool(db)

    user = User(username="shrek")
    db.add(user)

    reviewer_pool.add_user(user)
    assert reviewer_pool.has_user(user)
    assert user in reviewer_pool.get_members()


def test_can_remove_users_from_pool(db):
    (reviewer_pool, _) = get_test_pool(db)

    user = User(username="ed")
    db.add(user)

    reviewer_pool.add_user(user)
    reviewer_pool.remove_user(user)

    assert not reviewer_pool.has_user(user)
    assert not user in reviewer_pool.get_members()


def test_cannot_remove_owner_from_pool(db):
    (reviewer_pool, owner) = get_test_pool(db)

    reviewer_pool.remove_user(owner)

    assert reviewer_pool.has_user(owner)



