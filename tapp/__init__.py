import os

from flask import Flask
from flask_login import LoginManager

from .auth import ldap_handler
from .mocks import fake_ldap_handler
from .db.models import *
from .db import database
from .messages import messages

configuration_switch = {
    'default': 'tapp.config.DevConfig',  # Development configuration (fake LDAP)
    'dev_real': '.config.DevRealConfig',  # Development configuration (real LDAP)
    'staging': 'tapp.config.StagingConfig',  # Staging configuration (should be as close as possible to prod)
    'production': 'tapp.config.ProductionConfig'  # Production configuration
}

ENV = os.environ.get('ENV', 'default')

# SET UP =====================================

LOGIN_MANAGER = LoginManager()
LOGIN_MANAGER.login_view = 'auth.login'
LOGIN_MANAGER.login_message = messages.LOGIN_MANAGER_MESSAGE

LDAP = fake_ldap_handler.FAKE_LDAP if ENV == 'default' else ldap_handler.LDAP
DB = database.DB


# ===================================================

def create_app(test_configuration=None):
    """Application factory method"""
    app = Flask(__name__)

    # Configure the application
    if test_configuration:
        app.config.update(test_configuration)
    else:
        app.config.from_object(configuration_switch[ENV])

    # Register extensions ################################
    # |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  #
    ######################################################
    LDAP.init_app(app)
    LOGIN_MANAGER.init_app(app)
    DB.init_app(app)

    with app.app_context():
        DB.create_all()
    ############################################################

    from .views import auth, home
    app.register_blueprint(auth.bp)
    app.register_blueprint(home.bp)

    return app
