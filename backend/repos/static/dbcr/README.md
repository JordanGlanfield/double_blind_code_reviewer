# Setting up and configuring DBCR

Initial set up:
1) `pip install virtualenv` - package management requirements
2) `cd <project_dir>`
3) `virtualenv  venv` - make folder for packages
4) Activate local package management:
    - Windows: `venv\Scripts\activate` May need to run `Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Scope Process` in powershell before allowed to do this
    - Mac: `source venv/bin/activate`
    - Linux: `source venv/bin/activate`
5) `pip install -r requirements.txt` Install packages locally
6) For Linux, run `chmod +x dbcr/anonymous_filter` to allow execution of this script

To add packages:
1) Ensure virtual environment is active (should see `(venv)` at the start of your command prompt, run step 4 from above if not).
2) `pip install <package_name>`
3) `pip freeze > requirements.txt`

# Running DBCR

Start the MySQL service:
- Linux: `sudo systemctl start mysql`

The entry point for the program is `anonymiser_cli.py`. Run `python dbcr/anonymiser_cli` to start the program. Next, you may enter `help` to see a list of available commands.

An example flow in the tool is:
- `anonymise "source_repo_path" "destination_path"`
- `view-repos` to see id of newly anonymised repo
- `open-repo <desired_repo_id>` to target a specific repo
- `login <your_name>` to create or make active your pseudonym
- `view-comments "relative_file_path"` see comments on a file and their IDs
- `comment "your comment" "relative_file_path" <line_number> <id_of_parent_comment>` add a comment