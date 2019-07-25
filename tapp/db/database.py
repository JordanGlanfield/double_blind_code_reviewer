from flask_sqlalchemy import SQLAlchemy


class Database:
    def __init__(self):
        self.the_database = SQLAlchemy()

    def init_app(self, app):
        self.the_database.init_app(app)

    def delete(self, entry):
        self.the_database.session.delete(entry)
        self.the_database.session.commit()

    def delete_all(self, entries):
        for entry in entries:
            self.the_database.session.delete(entry)
        self.the_database.session.commit()

    def add_all(self, entries):
        for entry in entries:
            self.the_database.session.add(entry)
        self.the_database.session.commit()

    def update(self):
        self.the_database.session.commit()

    def add(self, entry):
        self.the_database.session.add(entry)
        self.the_database.session.commit()

    def create_all(self):
        self.the_database.create_all()

    def drop_all(self):
        self.the_database.drop_all()


DB = Database()
