import mysql.connector
from comments import Comment

# DB interaction set up

# TODO - delete user and use secure config for authentication
anon_db = mysql.connector.connect(
    host="localhost",
    database="anonymiser",
    user="anonymiser",
    passwd="anonymiser"
)


def get_cursor():
    return anon_db.cursor(prepared=True)


# Generic data transfer object for extracting records from the DB with named fields.
class DTO:
    def __init__(self, **kwargs):
        self.__dict__ = kwargs


# repository Table

def contains_repository(url: str):
    cursor = get_cursor()

    cursor.execute("""
        SELECT * FROM repository where url=%s
    """, (url,))

    cursor.fetchall()

    return cursor.rowcount > 0


def add_repository(url: str):
    if contains_repository(url):
        return -1

    cursor = get_cursor()

    cursor.execute("""
        INSERT INTO repository (url) VALUES (%s)
    """, (url,))

    anon_db.commit()

    return cursor.lastrowid


def get_repositories():
    cursor = get_cursor()

    cursor.execute("""
        SELECT * FROM repository
    """)

    records = cursor.fetchall()

    return [DTO(id=record[0], url=record[1]) for record in records]


def delete_repository(repo_id):
    cursor = get_cursor()

    cursor.execute("""
        DELETE FROM repository where id=%s
    """, (repo_id,))

    anon_db.commit()


# comment Table

def add_comment(comment: Comment, repo_id: int):
    cursor = get_cursor()

    cursor.execute("""
        INSERT INTO comment (contents, line_number, file_path, commenter_id, repo_id) VALUES (%s, %s, %s, %s, %s)
    """, (comment.get_contents(), comment.get_line_number(), comment.get_file_path(), comment.get_commenter_id(), repo_id,))

    anon_db.commit()

    if not comment.get_parent_id() or comment.get_parent_id() < 0:
        return cursor.lastrowid

    child_id = cursor.lastrowid

    cursor.execute("""
        INSERT INTO comment_reply (parent_id, child_id) VALUES (%s, %s)
    """, (comment.get_parent_id(), child_id,))

    anon_db.commit()

    return cursor.lastrowid


def get_comment(id: int):
    cursor = get_cursor()

    cursor.execute("""
        SELECT * FROM comment WHERE id=%s
    """, (id,))

    comment_record = cursor.fetchone()

    if not cursor.rowcount:
        return None

    cursor.execute("""
        SELECT * FROM comment_reply WHERE child_id=%s
    """, (id,))

    reply_record = cursor.fetchone()

    return Comment(id, comment_record[1], comment_record[2], comment_record[3], reply_record[1])


def get_file_comments(file_path: str, repo_id):
    cursor = get_cursor()

    cursor.execute("""
        SELECT * FROM
        comment LEFT JOIN comment_reply ON comment.id=comment_reply.child_id
        WHERE file_path=%s AND repo_id=%s
        ORDER BY line_number
    """, (file_path, repo_id,))

    comment_records = cursor.fetchall()

    comments = []

    for record in comment_records:
        comments.append(Comment(record[0], record[1], record[2], record[3], record[4], record[7]))

    return comments

# commenter Table

def add_commenter(name: str, pseudonym: str, repo_id: int):
    cursor = get_cursor()

    cursor.execute("""
        INSERT INTO commenter (name, pseudonym, repo_id) VALUES (%s, %s, %s)
    """, (name, pseudonym, repo_id,))

    anon_db.commit()

    return cursor.lastrowid


def record_to_commenter(record):
    return DTO(id=record[0], name=record[1], pseudonym=record[2], repo_id=record[3]) if record else None


def get_commenter_by_id(id: int):
    cursor = get_cursor()

    cursor.execute("""
        SELECT * FROM commenter WHERE id=%s
    """, (id,))

    record = cursor.fetchone()

    return record_to_commenter(record)


def get_commenter(name: str, repo_id: int):
    cursor = get_cursor()

    cursor.execute("""
        SELECT * FROM commenter WHERE name=%s AND repo_id=%s
    """, (name, repo_id,))

    record = cursor.fetchone()

    return record_to_commenter(record)


def get_num_commentors(repo_id: int):
    cursor = get_cursor()

    cursor.execute("""
        SELECT COUNT(*) FROM commenter WHERE repo_id=%s
    """, (repo_id,))

    return cursor.fetchone()[0]


