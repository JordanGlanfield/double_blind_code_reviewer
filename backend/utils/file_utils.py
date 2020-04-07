import grp
import json
import os
import pwd
import random
import string


def build_file_name(*tokens, ext=None):
    _random_string = "".join(random.choices(string.ascii_uppercase, k=5))
    return ("_".join(tokens) if tokens else _random_string) + (
        ".%s" % ext if ext else ""
    )


def dump_json_to_file(json_str, file_path):
    with open(file_path, "w+") as f:
        json.dump(json_str, f)


def read_json_file(file_path):
    with open(file_path, "r") as json_data:
        data = json.load(json_data)
        return data


def recursive_chown(path, username, groupname):
    uid = pwd.getpwnam(username).pw_uid
    gid = grp.getgrnam(groupname).gr_gid

    for dir_path, dir_names, file_names in os.walk(path):
        os.chown(dir_path, uid, gid)
        for filename in file_names:
            os.chown(os.path.join(dir_path, filename), uid, gid)