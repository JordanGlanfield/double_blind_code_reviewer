from typing import NamedTuple, List

from sqlalchemy import func

from backend import User, ReviewerPool, DB


class UserDto():
    def __init__(self, id: int, username: str, first_name: str, surname: str):
        self.id = id
        self.username = username
        self.first_name = first_name
        self.surname = surname

    @staticmethod
    def from_db(user: User):
        return UserDto(user.id, user.username, user.first_name, user.surname)


class ReviewerPoolDto():
    def __init__(self, id: int, name: str, description: str, owner: UserDto, members: List[UserDto]):
        self.id = id
        self.name = name
        self.description = description
        self.owner = owner
        self.members = members

    @staticmethod
    def from_db(reviewer_pool: ReviewerPool):
        return ReviewerPoolDto(reviewer_pool.id,
                               reviewer_pool.name,
                               reviewer_pool.description,
                               UserDto.from_db(reviewer_pool.owner),
                               [UserDto.from_db(member) for member in reviewer_pool.members])


class ReviewerPoolSummaryDto():
    def __init__(self, id: int, name: str, description: str, owner: UserDto, num_members: int):
        self.id = id
        self.name = name
        self.description = description
        self.owner = owner
        self.num_members = num_members

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