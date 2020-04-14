from flask import session


# TODO - lookup in DB rather than assume USERNAME = user_id
def get_active_username():
    return session["USERNAME"]