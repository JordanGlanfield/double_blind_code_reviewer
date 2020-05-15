from typing import List

from backend import User, ReviewerPool, File, Comment, Repo, Review


class UserDto():
    def __init__(self, username: str, first_name: str, surname: str):
        self.username: str = username
        self.first_name: str = first_name
        self.surname: str = surname

    @staticmethod
    def from_db(user: User):
        return UserDto(user.username, user.first_name, user.surname)


class ReviewerPoolDto():
    def __init__(self, id: str, name: str, description: str, owner: UserDto, members: List[UserDto]):
        self.id: str = id
        self.name: str = name
        self.description: str = description
        self.owner: UserDto = owner
        self.members: List[UserDto] = members

    @staticmethod
    def from_db(reviewer_pool: ReviewerPool):
        return ReviewerPoolDto(str(reviewer_pool.id),
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
        return ReviewerPoolSummaryDto(str(reviewer_pool.id),
                                      reviewer_pool.name,
                                      reviewer_pool.description,
                                      UserDto.from_db(reviewer_pool.owner),
                                      reviewer_pool.get_num_members())


class ReviewerPoolSummariesDto():

    @staticmethod
    def from_db(reviewer_pools: List[ReviewerPool]):
        return [ReviewerPoolSummaryDto.from_db(pool) for pool in reviewer_pools]


class ReviewDto():
    def __init__(self, review_id: str, repo_id: str, repo_name: str, clone_url: str, status: str):
        self.review_id = review_id
        self.repo_id = repo_id
        self.repo_name = repo_name
        self.clone_url = clone_url
        self.status = status

    @staticmethod
    def from_db(review: Review, base_url: str):
        repo = Repo.get(review.repo_id)
        return ReviewDto(str(review.id), str(repo.id), repo.name, get_clone_url(repo, base_url), "Pending")


class CommentDto():
    def __init__(self, id: str, author_pseudonym: str, contents: str, line_number: int, replies: List):
        self.id = id
        self.author_pseudonym = author_pseudonym
        self.contents = contents
        self.line_number = line_number
        self.replies = replies

    @staticmethod
    def from_comment(comment: Comment):
        replies = [CommentDto.from_comment(reply) for reply in comment.replies]
        return CommentDto(str(comment.id), comment.author.name, comment.contents, comment.line_number, replies)


class CommentListDto():

    @staticmethod
    def from_comments_nested(comments: List[Comment]) -> List[CommentDto]:
        return [CommentDto.from_comment(comment) for comment in comments]


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


class RepoDto():
    def __init__(self, id: str, name: str, clone_url: str):
        self.id = id
        self.name = name
        self.clone_url = clone_url

    @staticmethod
    def from_db(repo: Repo, base_url: str):
        clone_url = get_clone_url(repo, base_url)
        return RepoDto(str(repo.id), repo.name, clone_url)


def get_clone_url(repo: Repo, base_url: str):
    return "/".join([base_url, repo.id.hex, ".git"])