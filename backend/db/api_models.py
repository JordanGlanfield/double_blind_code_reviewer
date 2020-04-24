from typing import NamedTuple, List

from sqlalchemy import func

from backend import User, ReviewerPool, DB


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