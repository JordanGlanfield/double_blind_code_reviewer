import os


class BaseConfig:
    """Base configuration extended by environment-specific subclasses."""

    # Secret Keys ===============================================
    SECRET_KEY = os.environb.get(b"SECRET_KEY", "dev_secret_key")
    JWT_SECRET_KEY = os.environb.get(b"JWT_SECRET_KEY", "dev_jwt_secret_key")
    WTF_CSRF_SECRET_KEY = os.environb.get(b"WTF_CSRF_SECRET_KEY", "dev_wtf_secret_key")

    # JWT =======================================================

    # LDAP Service ==============================================
    LDAP_URL = "ldaps://ldaps-vip.cc.ic.ac.uk:636"
    LDAP_DN = "OU=Users,OU=Imperial College (London),DC=ic,DC=ac,DC=uk"

    # Database ===================================================
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class DevConfig(BaseConfig):
    SQLALCHEMY_DATABASE_URI = "sqlite:///dev.db"
    DEBUG = True


class StagingConfig(BaseConfig):
    SQLALCHEMY_DATABASE_URI = "sqlite:///staging.db"


class ProductionConfig(BaseConfig):
    # This one should be changed to a postgres db
    SQLALCHEMY_DATABASE_URI = "sqlite:////dbcr/storage/production.db"

