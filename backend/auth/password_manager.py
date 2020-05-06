import subprocess


class PasswordManager:
    def __init__(self):
        self.password_file = None
        self.app = None

    def init_app(self, app):
        self.app = app
        app.logger.info("Setting password file")
        if "PASSWORD_FILE" in app.config:
            app.logger.info(f"Found PASSWORD_FILE entry: {app.config['PASSWORD_FILE']}")
            self.password_file = app.config["PASSWORD_FILE"]

    def update_password(self, username: str, password: str):
        self.app.logger.info(f"Updated password for {username}")
        if self.password_file:
            subprocess.run(["htpasswd", "-bc", self.password_file, username, password])


PASSWORD_MANAGER = PasswordManager()