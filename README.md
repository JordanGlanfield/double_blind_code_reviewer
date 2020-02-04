# TApp: The Template App

This repository contains the python Flask application template adopted to develop all the applications in the
_edtech_ family. Such applications are used by staff and students in the Department of Computing.

## How to use this template

It's easy:

1. Fork it
2. Explore the code
3. Code a new app

Don't forget to replace the name `tapp` with your project's new name in the project's files. Beware of its presence in strings, which aren't taken care of by the "Rename"
option in IntelliJ Idea \*sigh\* (tips: look into `config.py`, `fake_ldap_handler.py` and patches in tests).

## Overview

The template, developed in Python and React.js, offers a standard application structure. The backend API is available under `tapp/`,
while the frontend logic can be found under (have a guess) the `frontend/` folder.
A quick overview of the application's organisation is given below:

| Package                                     | Content Description                                                          |
| ------------------------------------------- | ---------------------------------------------------------------------------- |
| `tapp/auth/`                                | LDAP authentication wrapper and utilities.                                   |
| `tapp/db/`                                  | Database wrapper (to remove database-specific code duplications) and models. |
| `tapp/mocks/`                               | Fake implementation of third-party modules (like LDAP).                      |
| `tapp/messages/`                            | Library to build and encode HTML messages.                                   |
| `tapp/views/`                               | Application [blueprints](http://flask.pocoo.org/docs/1.0/tutorial/views/).   |
| `tapp/static/`                              | Location of the frontend's production-build.                                 |
| `frontend/public`                           | Frontend entry-point.                                                        |
| `frontend/src/assets`                       | Static elements to serve (like images).                                      |
| `frontend/src/{components,constants,utils}` | React.js components and various utilities.                                   |

### Configuration

The application's configuration (in `tapp/config.py`) is object-based. Many preconfigured configurations
are provided, one per standard deployment environment. The available
configurations are _development_, _staging_ and _production_.
Any configuration other than _development_ (selected by default) can be enabled
by setting the `ENV` environment variable to the desired configuration name
(e.g. `export ENV=production` to enable the _production_ configuration).
The default _development_ configuration sets up the application to
run in isolation by replacing any external service provider (like LDAP) with its fake counterpart (in `tapp/mocks/`).

The application's instantiation is performed through the `create_app()` method in `tapp/__init__.py`
(in compliance with the **factory pattern**). The method accepts a dictionary configuration for
testing purposes, which -when provided- overrides the object-based
configuration.

## Running the Application during Development

### Backend

Before running the application, its dependencies must be available.
To download all the required dependencies:

- **create a virtual environment** by running `python3 -m venv venv`
- **activate the environment** by running `source venv/bin/activate`
- **install the dependencies** by executing `pip install --upgrade pip && pip install -r requirements.txt`

In a local development environment, the backend API can be run directly with flask (by default on localhost, port 5000).
To do so, run:

```
(venv) $ source scripts/dev_exports.sh
(venv) $ flask run
```

### Frontend

To start the frontend development server:

- **install [yarn](https://yarnpkg.com/lang/en/docs/install/#debian-stable) or [npm](https://www.npmjs.com/get-npm)** (only required the first time)
- **install all the JS dependencies** by running `npm install` or `yarn`
- **start the server** by running `npm start` or `yarn start`

Both backend and frontend dev server come with hot-reloading (meaning they will automatically restart on any relevant code change).

## Deployment

To deploy your app (or, well, to run it as you would in a production environment), from the project's root directory:

1. **bundle-up the frontend** by running `yarn --cwd frontend build` or `npm run build --prefix frontend`
2. **start the _gunicorn_ web-server** by running `source scripts/restart.sh`

The first step runs, in sequence, the _build_ and _postbuild_ commands defined in the _scripts_ section of `frontend/package.json`.
The application's frontend is served by Flask (see `tapp/views/index.py`). To achieve this, the `template_folder` and `static_folder` of the Flask application instance (in `tapp/__init__.py`) point to `build/` and `build/static` respectively.

Note that the _gunicorn_ web-server conveniently dumps all its activity to `$HOME/tapp.log`.

### Logging in with the default configuration

As already mentioned, the default configuration runs with a fake instance of the LDAP service (to make things easier
locally). The users recognised by this fake service must be defined in `fake_ldap_base/users.json`. You are provided
with one user, _Logan Howlett_ (sounds familiar?). To log into the application, enter the user name _logan_ and any
character you wish as password (the actual value is ignored by the fake LDAP).

## Testing

Backend tests are located under `tests/`.
This is pretty much empty in this project, apart from the configuration in `conftest.py`, where fixtures for a dummy application
instance, database and authentication handler are defined.
To run the tests, from the top directory of the project run `pytest` (with `-v` if you like to see many lines of text
on your screen).

No tests for the frontend have been written yet, but if they had been written, they'd be [Jest](https://jestjs.io/) tests.

## Continuous Integration

For your benefit, you are provided with a simple GitLabCI script in `txt` format. To use it for your project,
change the extension to `yml` and push it to your remote repository.
Note that you need to have a [GitLab Runner](https://docs.gitlab.com/runner/) spinning somewhere for the pipeline to be executed.

## General Development Conventions

### Precommit Checks

The project is supplied with a `.pre-commit-config.yml`. This file defines the checks that [pre-commit](https://pre-commit.com/) must execute on every `git commit`.
To use pre-commit (RECOMMENDED):

1. Install it, following the instructions available at the link provided;
2. Hook it to the project, by running `pre-commit install` from the project's root directory.
   Whenever a pre-commit check fails, it fixes the code in place for you and aborts the commit.
   You therefore have to `git add .` and reissue the `git commit` command.

### Backend Development

To test endpoints:
- 'curl -i http://localhost:5000/tapp/api/v1.0/repos/view/dir/gson/' for example


#### Global References

Objects that are supposed to be globally accessible across the application (like Flask's
login manager, the database object or the ldap service) should be instantiated and assigned to an upper-case-named constant in
the main file of their respective package (see `db/database.py`) and exposed to the app from `tapp/__init__.py` file.
This approach ensures one entry point for all the global references, and gives
the opportunity to seamlessly choose to use a different implementation of an application module
according to configuration-dependant factors.

The actual binding between these fundamental objects and the app itself happens
in the factory method, through the call to the `init_app()` method on each of these
objects' instance.

## System Requirements

This should do to get all the needed requirements on the machine where you need/wish to run the app:

```
sudo apt-get install \
    build-essential \
    python3-dev     \
    python3-venv    \
    libldap2-dev    \
    libsasl2-dev    \
    slapd           \
    ldap-utils      \
    python-tox      \
    lcov            \
    valgrind
```

## The Logo

Logos for applications in the _edtech_ group are created with [Faviator](https://www.faviator.xyz/). Not from the
web interface though. We do it from the command-line, like real men.

```
$ npm install -g faviator
$ faviator --size '180' \
           --text '<first letter of the app's name>' \
           --dx '0' \
           --font-size '62' \
           --font-family 'Fredericka the Great' \
           --font-color '#ffffff' \
           --background-color '<the app's theme colour>' \
           --border-width '3.5' \
           --border-color '#FFFFFF' \
           --border-radius '20' \
           --output favicon.png
```

To serve the so-obtained `favicon.png` as thumbnail for your app, simply do

```
mv /path/to/favicon.png /path/to/tapp/frontend/public/static/favicon.ico
```
