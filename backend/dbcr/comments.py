class Comment:
    __id: int
    __contents: str
    __line_number: int
    __file_path: str
    __commenter_id: int
    __parent_id: int

    def __init__(self, id, contents, line_number, file_path, commenter_id, parent_id):
        self.__id = id
        self.__line_number = line_number
        self.__file_path = file_path
        self.__parent_id = parent_id if parent_id is not None else -1
        self.__commenter_id = commenter_id
        self.__contents = contents

    def get_id(self):
        return self.__id

    def get_contents(self):
        return self.__contents

    def get_line_number(self):
        return self.__line_number

    def get_file_path(self):
        return self.__file_path

    def get_commenter_id(self):
        return self.__commenter_id

    def get_parent_id(self):
        return self.__parent_id

    def __str__(self):
        return self.__contents


class CommentDto:
    id: int
    contents: str
    line_number: int
    file_path: str
    author_pseudonym: str
    parent_id: int

    def __init__(self, id, contents, line_number, file_path, author_pseudonym, parent_id):
        self.id = id
        self.contents = contents
        self.line_number = line_number
        self.file_path = file_path
        self.author_pseudonym = author_pseudonym
        self.parent_id = parent_id


def comment_to_dto(comment: Comment) -> CommentDto:
    return CommentDto(comment.get_id(),
                      comment.get_contents(),
                      comment.get_line_number(),
                      comment.get_file_path(),
                      str(comment.get_commenter_id()), # TODO - pseudonymise
                      comment.get_parent_id())