import logging
import os
from logging.handlers import RotatingFileHandler

from flask import Flask
from flask.logging import default_handler
from flask_login import LoginManager
from flask_migrate import Migrate

from .auth import ldap_handler
from .db import database
from .db.models import *
from .messages import messages
from .mocks import fake_ldap_handler
from .utils.json import ObjectJsonEncoder

configuration_switch = {
    "development": "backend.config.DevConfig",  # Development configuration (fake LDAP)
    "staging": "backend.config.StagingConfig",  # Staging configuration (should be as close as possible to prod)
    "production": "backend.config.ProductionConfig",  # Production configuration
}

ENV = os.environ.get("FLASK_ENV", "development")

# SET UP =====================================

LOGIN_MANAGER = LoginManager()
LOGIN_MANAGER.login_view = "auth.login"
LOGIN_MANAGER.login_message = messages.LOGIN_MANAGER_MESSAGE

LDAP = fake_ldap_handler.FAKE_LDAP # if ENV == "default" else ldap_handler.LDAP
DB = database.DB
MIGRATE = None


# ===================================================

def config_logger(app: Flask):
    if not app.config["LOG_FILE"]:
        return

    app.logger.removeHandler(default_handler)

    formatter = logging.Formatter('[%(asctime)s] %(levelname)s in %(module)s: %(message)s')
    handler = RotatingFileHandler(filename=app.config["LOG_FILE"], maxBytes=1024**3, backupCount=3)
    handler.setFormatter(formatter)
    app.logger.addHandler(handler)
    app.logger.setLevel(logging.INFO)


def create_app(test_configuration=None):
    """Application factory method"""
    app = Flask(__name__, static_folder="../build/static", template_folder="../build")

    # Configure the application
    if test_configuration:
        app.config.update(test_configuration)
    else:
        app.config.from_object(configuration_switch[ENV])

    config_logger(app)

    # Register extensions ################################
    # |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  #
    ######################################################
    DB.init_app(app)
    LDAP.init_app(app)
    LOGIN_MANAGER.init_app(app)
    global MIGRATE
    MIGRATE = Migrate(app, DB.db)

    with app.app_context():
        DB.create_all()

    ############################################################

    from .views import auth, index
    from .repos import repos
    from .reviews import reviews

    app.register_blueprint(auth.bp)
    app.register_blueprint(repos.repos_bp)
    app.register_blueprint(reviews.reviews_bp)
    # index must be registered last as it has a catch all route to direct the user to the react app
    app.register_blueprint(index.bp)

    app.json_encoder = ObjectJsonEncoder

    return app