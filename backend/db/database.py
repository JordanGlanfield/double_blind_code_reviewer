from sqlite3 import Connection as SQLite3Connection
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import event
from sqlalchemy.engine import Engine


@event.listens_for(Engine, "connect")
def _set_sqlite_pragma(dbapi_connection, connection_record):
    if isinstance(dbapi_connection, SQLite3Connection):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON;")
        cursor.close()


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
