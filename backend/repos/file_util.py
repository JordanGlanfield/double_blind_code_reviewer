import os

BASE_PATH = "/backend/repos/static/"


def get_directory_contents(path: str):
    if ".." in path:
        return

    path = BASE_PATH + path

    contents = {"directories": [], "files": []}

    try:
        content_names = os.listdir(path)
    except OSError:
        return contents

    for filename in content_names:
        if os.path.isdir(os.path.join(path, filename)):
            contents["directories"].append(filename)
        else:
            contents["files"].append(filename)

    return contents