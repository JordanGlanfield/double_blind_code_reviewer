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
