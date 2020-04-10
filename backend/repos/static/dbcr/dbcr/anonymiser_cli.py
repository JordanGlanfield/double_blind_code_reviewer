#!/usr/bin/env python3

import click
from click_shell import shell
from git import Repo
import anonymiser
import comments as cmts
import users
import storage

@shell(prompt="anonymiser > ", intro="Starting anonymiser")
def app():
    pass


active_repo = -1


def set_active_repo(repo: int):
    global active_repo
    active_repo = repo
    print("Repository %s is the active repository" % repo)


def get_repo_id():
    return active_repo


def check_for_repo_existence(url):
    if storage.contains_repository(url):
        print("Repository for provided URL already exists")
        return True
    return False


def verify_and_set_repo(repo):
    if repo < 0:
        print("Adding repository failed")
    else:
        print("Done")
        set_active_repo(repo)


@app.command()
@click.argument('url')
@click.argument('target_directory')
@click.argument('blacklist', nargs=-1)
def anonymise(url, target_directory, blacklist):
    """anonymise <url> <target_directory> <blacklisted_1> <blacklisted_2> ...

    url = URL or SSH target of git repository

    target_directory = path to clone repository to

    blacklist = list of names that will be stripped from commit messages
    """

    if check_for_repo_existence(url):
        return

    try:
        repo = Repo.clone_from(url, target_directory)
    except Exception as e:
        print("There was a problem cloning the repository:\n", e)
        return

    try:
        anonymiser.anonymise(repo.working_dir, blacklist)
    except Exception as e:
        print(e)
        return

    verify_and_set_repo(storage.add_repository(url))


@app.command()
@click.argument('source')
@click.argument('dest')
@click.argument('blacklist', nargs=-1)
def anonymise_local(source, dest, blacklist):
    """anonymise-local <source> <dest> <blacklisted_1> <blacklisted_2> ...

    source = path to git repository

    dest = path to store anonymised repository at

    blacklist = list of names that will be stripped from commit messages
    """

    if check_for_repo_existence(source):
        return

    try:
        anonymiser.copy_files(source, dest)
        anonymiser.anonymise(dest, blacklist)
    except Exception as e:
        print("There was a problem copying and anonymising the files")
        print(e)
        return

    verify_and_set_repo(storage.add_repository(dest))


@app.command()
def view_repos():
    repos = storage.get_repositories()

    for repo in repos:
        print("%s: %s" % (repo.id, repo.url))


@app.command()
@click.argument('repo')
def open_repo(repo):
    """open-repo <repo>

    repo = id of repo you wish to operate on
    """
    try:
        repo_id = int(repo)
    except ValueError:
        print("You must enter a whole number")
        return

    set_active_repo(repo_id)
    print("Active repo is now: %s" % get_repo_id())

@app.command()
@click.argument('repo')
def delete_repo(repo):
    """delete-repo <repo>

    repo = id of repo you wish to delete
    """
    print("Deleting the repo will delete all comments and commenters associated with this repo")
    if not click.confirm("Are you sure you wish to continue?"):
        return

    storage.delete_repository(repo)

    print("Repository deleted")

@app.command()
@click.argument('username')
def login(username):
    """login <username>

    username = name to begin session with
    """

    if get_repo_id() < 0:
        print("Please open a repository using 'view-repos' and 'open-repo' commands first")
        return

    users.login(username, get_repo_id())
    print("Your comments are now anonymous")


@app.command()
@click.argument('comment')
@click.argument('file')
@click.argument('line_number')
@click.argument('reply_to', required=False)
def comment(comment, file, line_number, reply_to=-1):
    """comment <comment> <file> <line_number> <reply_to>

    comment = comment to leave

    file = file to comment on

    line_number = line number to comment on

    reply_to = optionally the comment id this is replying to
    """

    if not users.get_pseudonym():
        print("You must 'login' to make comments")
        return

    try:
        line_number = int(line_number)
    except ValueError:
        print("You must enter a numerical line number")

    if reply_to:
        try:
            reply_to = int(reply_to)
        except ValueError:
            print("You must enter a valid comment ID to reply to")

    new_comment = cmts.Comment(-1, comment, line_number, file, users.get_user_id(), reply_to)
    print("Repo id: ", get_repo_id())
    storage.add_comment(new_comment, get_repo_id())
    print("Comment added. View with 'view-comments %s'" % file)


@app.command()
@click.argument('file')
def view_comments(file):
    comments = storage.get_file_comments(file, get_repo_id())

    def sortComment(comment):
        return comment.get_line_number()

    comments.sort(key=sortComment)

    if len(comments) == 0:
        print("No comments for {}".format(file))
        return

    print("Comments for {}:".format(file))

    for comment in comments:
        commenter = storage.get_commenter_by_id(comment.get_commenter_id())
        display_comment = "---\nComment {} on line {}\n{} says: {}\n"\
            .format(comment.get_id(), comment.get_line_number(), commenter.pseudonym, comment.get_contents())

        reply_to = comment.get_parent_id()

        if reply_to and reply_to >= 0:
            display_comment = display_comment + "In reply to comment {}\n".format(reply_to)

        print(display_comment)


if __name__ == '__main__':
    app()