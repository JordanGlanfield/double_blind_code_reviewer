from ..auth.ldap_constants import DN, MEMBERSHIPS, TITLE, NAME, SURNAME
from .. import LDAP

WHITE_LIST = [
    'ictsec'
]


def login(username, password):
    """
    Perform (a) LDAP authentication and (b) additional (app specific) verifications
    before granting access and returning the user LDAP attributes
    'name, surname, title and memberships'
    :param username: user login name
    :param password: user password
    :return: Attributes name, surname, title and memberships of user
             on successful login; ldap.INVALID_CREDENTIALS exception otherwise
    """
    ldap_attributes = LDAP.ldap_login(username, password, query_attrs=(TITLE, NAME, SURNAME, DN, MEMBERSHIPS))
    return custom_authentication_checks(username, ldap_attributes)


def custom_authentication_checks(username, ldap_attributes):
    # ADD HERE CUSTOM HIGHER-LEVEL CHECKS
    # e.g.:
    #
    # if 'doc' not in dict_attrs[DN]['OU']: # is 'doc' in the organisation sub-attribute?
    #     if 'doc-all-students' not in dict_attrs[MEMBERSHIPS]['CN']: # is 'doc-all-students' among the memberships?
    #         raise ldap.INVALID_CREDENTIALS # raise INVALID_CREDENTIALS exception
    return ldap_attributes

# To enforce a distinction between "student" and "staff", the `ldap_constant_TITLE` ldap attribute is
# requested (see above) and associated to the user model. The following decorator is then an example
# on how to leverage the title to implement title-based access (where DEFAULT_REDIRECTION is assigned
# a convenient application route).
# For inspiration on how to implement title-based access, refer to emarking's source code:
#   https://gitlab.doc.ic.ac.uk/edtech/emarking
#
# def role_required(access_role, redirection_url=None):
#     def decorator(f):
#         @wraps(f)
#         def decorated_function(*args, **kwargs):
#             if current_user.title == access_role:
#                 return f(*args, **kwargs)
#             return redirect(url_for(redirection_url or DEFAULT_REDIRECTION))
#         return decorated_function
#     return decorator
