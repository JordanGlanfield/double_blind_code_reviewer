from . import storage

user_id = -1
active_pseudonym = ""


# Login -> retrieve pseudonym or create new and add to list
def login(username: str, repo_id: int) -> str:
    commenter = storage.get_commenter(username, repo_id)

    global user_id

    if not commenter:
        pseudonym = "anonymous" + str(storage.get_num_commentors(repo_id))
        user_id = storage.add_commenter(username, pseudonym, repo_id)
        print("User '{}' now has pseudonym '{}'".format(username, pseudonym))
    else:
        pseudonym = commenter.pseudonym
        user_id = commenter.id
        print("Welcome back {}, your pseudonym is '{}'".format(username, pseudonym))

    global active_pseudonym
    active_pseudonym = pseudonym
    return pseudonym


def get_pseudonym() -> str:
    return active_pseudonym


def get_user_id() -> int:
    return user_id