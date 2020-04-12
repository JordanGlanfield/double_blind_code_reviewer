from flask_sqlalchemy import SQLAlchemy


class Database:
    def __init__(self):
        self.db = SQLAlchemy()

    def init_app(self, app):
        self.db.init_app(app)

    def delete(self, entry):
        self.db.session.delete(entry)
        self.db.session.commit()

    def delete_all(self, entries):
        for entry in entries:
            self.db.session.delete(entry)
        self.db.session.commit()

    def add_all(self, entries):
        for entry in entries:
            self.db.session.add(entry)
        self.db.session.commit()

    def update(self):
        self.db.session.commit()

    def add(self, entry):
        self.db.session.add(entry)
        self.db.session.commit()

    def create_all(self):
        self.db.create_all()

    def drop_all(self):
        self.db.drop_all()


DB = Database()
