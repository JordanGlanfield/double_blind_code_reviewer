# TAPP: The Template App

This repository contains the python Flask application template adopted to develop all the applications in the
*edtech* family. Such applications are used by staff and students in the Department of Computing.

## How to use this template

It's easy:
1. Clone it
2. Explore the code
3. Remove the `.git` folder and create a fresh repo for your project

Don't forget to replace the name `tapp` with your project's new name. Beware its presence in strings (which aren't taken care of by the "Rename"
option in IntelliJ Idea \*sigh\* (tips: look into `config.py`, `fake_ldap_handler.py` and patches in tests)/


## Overview

The template offers a standard application structure under the `tapp/`
folder. A quick overview of the application's organisation is given below:

| Package | Content Description |
|---------|--------------------------|
| `auth/` | LDAP authentication wrapper and utilities. |
| `db/` | Database wrapper (to remove database-specific code duplications) and models. |
| `mocks/` | Fake implementation of third-party modules (like LDAP). |
| `messages/` | Library to build and encode HTML messages. |
| `static/`, `templates/` | Standard Flask application folders for static content and HTML templates. |
| `views/` | Application [blueprints](http://flask.pocoo.org/docs/1.0/tutorial/views/). |

### Configuration

The application's configuration (in `config.py`) is object-based. Many preconfigured configurations 
are provided, one per standard deployment environment. The available
configurations are *development*, *staging* and *production*.
Any configuration other than *development* (selected by default) can be enabled
by setting the `ENV` environment variable to the desired configuration name
(e.g. `export ENV=production` to enable the *production* configuration).
The default *development* configuration sets up the application to
run in isolation by replacing any external service provider (like LDAP) with its fake counterpart (in `mocks/`).

The application's instantiation is performed through the `create_app()` method in `tapp/__init__.py`
(in compliance with the **factory pattern**). The method accepts a dictionary configuration for
testing purposes, which -when provided- overrides the object-based
configuration.

## Running the Application 
Before running the application, its dependencies must be available.
To download all the required dependencies:
- **create a virtual environment** by running `python3 -m venv venv`
- **activate the environment** by running `source venv/bin/activate`
- **install the dependencies** by executing `pip install --upgrade pip && pip install -r requirements.txt`

In a local development environment, the app can be run directly with flask (by default on localhost, port 5000).
To do so, run:
```
(venv) $ FLASK_ENV=development FLASK_APP=tapp FLASK_DEBUG=True flask run 
```

In a staging/production environemnt, the app is run "behind" a gunicorn web-server. The code to start (and *re*start)
the web-server, executed during the deployment stage of the pipeline defined in `.gitlab-ci.yml`, is in `scripts/restart`.

### Logging in with the default configuration
As already mentioned, the default configuration runs with a fake instance of the LDAP service (to make things easier
locally). The users recognised by this fake service must be defined in `fake_ldap_base/users.json`. You are provided
with one user, *Logan Howlett* (sounds familiar?). To log into the application, enter the user name *logan* and any
character you wish as password (the actual value is ignored by the fake LDAP).

## Testing
A stub test-suite is provided for the *auth* view. You can find there examples of how to test routes and how to use
pytest's parameterisation. The interesting bit is however in `conftest.py`, where fixtures for a dummy application 
instance, database and authentication operations are defined.
To run tests, from the top directory of the project run `pytest` (with `-v` if you are the wordy type). 

## General Development Conventions

### Global references 
Objects that are supposed to be globally accessible across the application (like Flask's
login manager, the database object or the ldap service) should be instantiated and assigned to an upper-case-named constant in 
the main file of their respective package (see `db/database.py`) and exposed to the app from `tapp/__init__.py` file.
This approach ensures one entry point for all the global references, and gives
the opportunity to seamlessly choose to use a different implementation of an application module
according to configuration-dependant factors.

The actual binding between these fundamental objects and the app itself happens
in the factory method, by calling the `init_app()` method on each of these
objects' instance.

## Requirements

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

Logos for applications in the *edtech* group are created with [Faviator](https://www.faviator.xyz/). Not from the 
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