# DBCR

This is the double-blind code review tool. It allows a group of people to join a reviewer pool. Members can complete a
coding exercise and have their code reviewed (in a double-blind anonymous manner) by other members.

The initial application structure of the tool is based on Ivan Procaccini's template application which he has lovingly
developed for use with web apps built at Imperial College London.

## Installation

The tool uses Docker. You can install Docker [here](https://www.docker.com/get-started).

To download the latest published image:
- `docker pull jordanglanfield/dbcr:latest`

To build the application image locally from the top level project directory, run the following:
- `docker build --tag dbcr:latest .` 
- You may change the tag from `latest` to whatever you wish, simply change the same tag in the command below to
run your version of the tool.

## Local Deployment

To run the built image:
- `docker run --publish 80:80 --detach -v storage_volume:/dbcr/storage --name dbcr dbcr:latest`
- Visiting http://localhost/ will take you to the tool

## Overview

The backend API is available under `backend/` while the frontend logic can be found the `frontend/` folder.
A quick overview of the application's organisation is given below:

| Package                                     | Content Description                                                          |
| ------------------------------------------- | ---------------------------------------------------------------------------- |
| `backend/auth/`                                | Authentication utilities.                                   |
| `backend/db/`                                  | Database wrapper (to remove database-specific code duplications) and models. |
| `backend/views/`                               | Application [blueprints](http://flask.pocoo.org/docs/1.0/tutorial/views/).   |
| `backend/repos`                                | Logic for managing user repos |
| `backend/reviews`                                | Logic for managing reviews and review assignment |
| `frontend/public`                           | Frontend entry-point.                                                        |
| `frontend/src/assets`                       | Static elements to serve (like images).                                      |
| `frontend/src/{components,constants,utils}` | React.js components and various utilities in typescript.                                   |

## Configuration

The application's configuration (in `backend/config.py`) is object-based. Many preconfigured configurations
are provided, one per standard deployment environment. The available
configurations are _development_, _staging_ and _production_.
Any configuration other than _development_ (selected by default) can be enabled
by setting the `FLASK_ENV` environment variable to the desired configuration name
(e.g. `export FLASK_ENV=production` to enable the _production_ configuration).

The application's instantiation is performed through the `create_app()` method in `backend/__init__.py`
(in compliance with the **factory pattern**). The method accepts a dictionary configuration for
testing purposes, which -when provided- overrides the object-based
configuration.

## Development

The backend of the project lives under `backend` and consists of a Flask application under `backend/__init__.py`.
You can run a development instance of the backend from here; however, features for working with Git will only
function in the Docker build, which includes an Nginx reverse proxy, Gunicorn in front of the Flask application, and
a Git server.

Useful commands:
- Get shell in docker container: `docker exec -i -t dbcr /bin/bash`
- Read nginx logs: `tail -f /var/log/nginx/access.log`

Note, "dangling" images may be produced by the build process. Use the following to remove these:
- `docker rmi $(docker images -f "dangling=true" -q)`

For run configuration in IntelliJ, run the `Dockerfile` to get an initial configuration then add the following:
- Image tag: `jordanglanfield/dbcr:latest`
- Container name: `dbcr`
- Run options: `--publish 80:80 --detach -v storage_volume:/dbcr/storage`

### Running the Flask backend directly

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

Using gunicorn from above backend directory:
```
gunicorn -b 127.0.0.1:5000 tapp.wsgi:app
```

### Running React frontend directly

To start the frontend development server:

- **install [yarn](https://yarnpkg.com/lang/en/docs/install/#debian-stable) or [npm](https://www.npmjs.com/get-npm)** (only required the first time)
- **install all the JS dependencies** by running `npm install` or `yarn`
- **start the server** by running `npm start` or `yarn start`

Both backend and frontend dev server come with hot-reloading (meaning they will automatically restart on any relevant code change).

## Testing

Backend tests are located under `tests/`. Fixtures for a dummy application instance, database and authentication
handler are defined under tests/fixtures.
To run the tests, from the top directory of the project run `pytest` (with `-v` if you like to see many lines of text
on your screen).

No tests for the frontend have been written yet, but if they had been written, they'd be [Jest](https://jestjs.io/) tests.

## General Development Conventions

### Precommit Checks

The project is supplied with a `.pre-commit-config.yml`. This file defines the checks that [pre-commit](https://pre-commit.com/) must execute on every `git commit`.
To use pre-commit (RECOMMENDED):

1. Install it, following the instructions available at the link provided;
2. Hook it to the project, by running `pre-commit install` from the project's root directory.
   Whenever a pre-commit check fails, it fixes the code in place for you and aborts the commit.
   You therefore have to `git add .` and reissue the `git commit` command.

#### Global References

Objects that are supposed to be globally accessible across the application (like Flask's
login manager, the database object or the ldap service) should be instantiated and assigned to an upper-case-named constant in
the main file of their respective package (see `db/database.py`) and exposed to the app from `backend/__init__.py` file.
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
