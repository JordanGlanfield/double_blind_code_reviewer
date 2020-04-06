import mysql.connector

# TODO - delete user and use secure config for authentication
anon_db = mysql.connector.connect(
    host="localhost",
    user="anonymiser",
    passwd="anonymiser"
)

init_cursor = anon_db.cursor()
init_cursor.execute("CREATE DATABASE IF NOT EXISTS anonymiser DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")

anon_db.close()
init_cursor.close()

anon_db = mysql.connector.connect(
    host="localhost",
    database="anonymiser",
    user="anonymiser",
    passwd="anonymiser"
)

cursor = anon_db.cursor(prepared=True)

common_max_url_length = 2083

cursor.execute("""
CREATE TABLE repository (
    id INT NOT NULL AUTO_INCREMENT,
    url VARCHAR(%s),
    PRIMARY KEY (id)
)
""" % common_max_url_length)

cursor.execute("""
CREATE TABLE commenter (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(40),
    pseudonym VARCHAR(40),
    repo_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (repo_id) REFERENCES repository(id) ON DELETE CASCADE
)
""")

cursor.execute("""
CREATE TABLE comment (
    id INT NOT NULL AUTO_INCREMENT,
    contents TEXT,
    line_number INT,
    file_path VARCHAR(4096),
    commenter_id INT NOT NULL,
    repo_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (commenter_id) REFERENCES commenter(id),
    FOREIGN KEY (repo_id) REFERENCES repository(id) ON DELETE CASCADE
)
""")

cursor.execute("""
CREATE TABLE comment_reply (
    child_id INT NOT NULL,
    parent_id INT NOT NULL,
    PRIMARY KEY (child_id),
    FOREIGN KEY (parent_id) REFERENCES comment(id) ON DELETE CASCADE,
    FOREIGN KEY (child_id) REFERENCES comment(id) ON DELETE CASCADE 
)
""")

cursor.close()

anon_db.close()
