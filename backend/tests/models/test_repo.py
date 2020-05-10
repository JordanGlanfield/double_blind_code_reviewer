
from ..fixtures import *
from ... import Repo, Review, AnonUser


def get_repo(authed_user) -> Repo:
    repo = Repo(name="Test Repo", owner_id=authed_user.id)
    repo.save()
    return repo


def test_can_retrieve_repo_contributors(db, authed_user):
    repo = get_repo(authed_user)

    review = Review(repo_id=repo.id, submitter_id=authed_user.id)
    review.save()

    anon_users = [AnonUser(name=f"Anon{i}", user_id=authed_user.id, review_id=review.id) for i in range(0, 3)]
    for anon_user in anon_users:
        anon_user.save()

    contributors = repo.get_review_contributors()

    assert len(contributors) == 4
    assert contributors[0].user_id == authed_user.id

    for i in range(1, 4):
        assert contributors[i].name == f"Anon{i - 1}"

    assert repo.is_user_a_contributor(authed_user.id)


def test_users_not_part_of_review_are_not_contributors(db, authed_user):
    repo = get_repo(authed_user)

    user = User(username="Name", first_name="First", surname="Last")
    user.save_with_password("password")

    assert not repo.is_user_a_contributor(user.id)