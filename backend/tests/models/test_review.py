from ... import Repo, Review

from ..fixtures import *

def get_review(authed_user) -> Review:
    repo = Repo(name="Test Repo", owner_id=authed_user.id)
    repo.save()

    review = Review(repo_id=repo.id, submitter_id=authed_
    review.save()

    return review


def test_can_check_user_is_in_review(db, authed_user):
    review = get_review(authed_user)

    assert review.is_user_in_review(authed_user)

