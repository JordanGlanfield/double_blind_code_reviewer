import os
import re
from typing import List

import git_filter_repo as gfr

anonymous_name = b"anonymous"


def message_callback(message, blacklist: List[bytes]):
    for name in blacklist:
        regex = re.compile(name, re.IGNORECASE)
        message = regex.sub(anonymous_name, message)
    return message


def name_callback(name):
    return anonymous_name


def email_callback(email):
    return anonymous_name


def anonymise(path: str, blacklist: List[str]):
    options = gfr.FilteringOptions.default_options()
    options.force = True
    blacklist_bytes = [name.encode("utf-8") for name in blacklist]

    os.chdir(path)

    filter = gfr.RepoFilter(options,
                            message_callback=lambda message: message_callback(message, blacklist_bytes),
                            name_callback=name_callback,
                            email_callback=email_callback)

    filter.run()


