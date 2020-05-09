from typing import NamedTuple, List

from backend import User, ReviewerPool, File, Comment


class UserDto():
    def __init__(self, id: str, username: str, first_name: str, surname: str):
        self.id: str = id
        self.username: str = username
        self.first_name: str = first_name
        self.surname: str = surname

    @staticmethod
    def from_db(user: User):
        return UserDto(user.id, user.username, user.first_name, user.surname)


class ReviewerPoolDto():
    def __init__(self, id: str, name: str, description: str, owner: UserDto, members: List[UserDto]):
        self.id: str = id
        self.name: str = name
        self.description: str = description
        self.owner: UserDto = owner
        self.members: List[UserDto] = members

    @staticmethod
    def from_db(reviewer_pool: ReviewerPool):
        return ReviewerPoolDto(reviewer_pool.id,
                               reviewer_pool.name,
                               reviewer_pool.description,
                               UserDto.from_db(reviewer_pool.owner),
                               [UserDto.from_db(member) for member in reviewer_pool.members])


class ReviewerPoolSummaryDto():
    def __init__(self, id: str, name: str, description: str, owner: UserDto, num_members: int):
        self.id: str = id
        self.name: str = name
        self.description: str = description
        self.owner: UserDto = owner
        self.num_members: int = num_members

    @staticmethod
    def from_db(reviewer_pool: ReviewerPool):
        return ReviewerPoolSummaryDto(reviewer_pool.id,
                                      reviewer_pool.name,
                                      reviewer_pool.description,
                                      UserDto.from_db(reviewer_pool.owner),
                                      len(reviewer_pool.get_members().all()))


class ReviewerPoolSummariesDto(NamedTuple):
    reviewer_pools: List[ReviewerPoolSummaryDto]

    @staticmethod
    def from_db(reviewer_pools: List[ReviewerPool]):
        return [ReviewerPoolSummaryDto.from_db(pool) for pool in reviewer_pools]


class CommentDto():
    def __init__(self, author_pseudonym: str, content: str, line_number: int, replies: List):
        self.author_pseudonym = author_pseudonym
        self.content = content
        self.line_number = line_number
        self.replies = replies

    @staticmethod
    def from_comments(comments: List[Comment]):
        pass


class FileCommentsDto():
    def __init__(self, comments: List[CommentDto]):
        self.comments = comments

    # TODO: take into consideration review id
    @staticmethod
    def from_db(file: File):
        # comments = Comment.query.filter_by(file_id=file.id).all()
        # comments_by_id = dict()
        #
        # for comment in comments:
        pass
