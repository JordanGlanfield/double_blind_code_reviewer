import shutil

from git import Repo, Actor

from backend.repos.anonymous_filter import anonymise, get_anonymous_name, get_anonymous_email
from backend.tests.test_utils import get_resource_path

from ..fixtures import *

test_name = "test_name"
blacklist = ["test_name"]


def test_can_anonymise_a_repo(temp_dir):
    path = get_resource_path(["test_repo"])
    print(temp_dir.name)
    join = os.path.sep.join([temp_dir.name, "test_repo"])
    repo_path = shutil.copytree(path, join)
    anonymise(repo_path, blacklist)

    repo = Repo(repo_path)
    for commit in repo.iter_commits():
        print(commit.message)
        assert not test_name in commit.message
        assert commit.author.name == get_anonymous_name()
        assert commit.author.email == get_anonymous_email()
        assert commit.committer.name == get_anonymous_name()
        assert commit.committer.name == get_anonymous_email()
