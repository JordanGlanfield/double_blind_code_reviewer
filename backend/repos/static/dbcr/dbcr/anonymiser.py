import os

import gitlab
import subprocess
import shutil as files
from pathlib import Path

def copy_files(source, destination):
    try:
        if not Path(destination).exists():
            files.copytree(source, destination)
        else:
            print("Note: destination directory already exists")
    except:
        print("Failed to copy files from source '{}' to destination '{}'".format(source, destination))
        exit(1)


def anonymise(repo, blacklisted):
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    command = ['./anonymous_filter', repo]
    command.extend(blacklisted)

    try:
        result = subprocess.call(command)
    except:
        print("Failed to anonymise copy with result '{}'".format(result))
        exit(2)

def run_command(command):
    process = subprocess.Popen(command, stdout=subprocess.PIPE, shell=True)
    process.wait()
    proc_stdout = process.communicate()[0].strip()
    return proc_stdout