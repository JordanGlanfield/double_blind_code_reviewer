import subprocess


class PasswordManager:
    def __init__(self):
        self.password_file = None

    def init_app(self, app):
        if "PASSWORD_FILE" in app.config:
            self.password_file = app.config["PASSWORD_FILE"]

    def update_password(self, username: str, password: str):
        if self.password_file:
            subprocess.run(["htpasswd", self.password_file, username, password])


PASSWORD_MANAGER = PasswordManager()