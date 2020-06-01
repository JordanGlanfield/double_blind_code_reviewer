import re
from typing import List

from backend import User, ReviewerPool, File, Comment, Repo, Review, ReviewFeedback
from backend.utils.session import get_active_user


class UserDto():
    def __init__(self, username: str, first_name: str, surname: str, is_admin: bool):
        self.username: str = username
        self.first_name: str = first_name
        self.surname: str = surname
        self.is_admin: bool = is_admin

    @staticmethod
    def from_db(user: User):
        return UserDto(user.username, user.first_name, user.surname, user.is_admin)


class ReviewerPoolDto():
    def __init__(self, id: str, name: str, description: str, invite_code: str, owner: UserDto, members: List[UserDto]):
        self.id: str = id
        self.name: str = name
        self.description: str = description
        self.invite_code: str = invite_code
        self.owner: UserDto = owner
        self.members: List[UserDto] = members

    @staticmethod
    def from_db(reviewer_pool: ReviewerPool):
        return ReviewerPoolDto(str(reviewer_pool.id),
                               reviewer_pool.name,
                               reviewer_pool.description,
                               reviewer_pool.invite_code,
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
    def __init__(self, review_id: str, repo_id: str, repo_name: str, review_name: str, clone_url: str,
                 is_completed: bool, has_feedback: bool):
        self.review_id = review_id
        self.repo_id = repo_id
        self.repo_name = repo_name
        self.review_name = review_name
        self.clone_url = clone_url
        self.is_completed = is_completed
        self.has_feedback = has_feedback

    @staticmethod
    def from_db(review: Review, base_url: str, review_name: str):
        repo = Repo.get(review.repo_id)
        has_feedback = ReviewFeedback.find_feedback_by_review(review.id) is not None
        return ReviewDto(str(review.id), str(repo.id), repo.name, review_name, get_clone_url(repo, base_url),
                         review.is_completed, has_feedback)


class ReviewListDto():

    @staticmethod
    def from_db(reviews: List[Review], base_url: str):
        review_dtos = []
        for i in range(0, len(reviews)):
            review_dtos.append(ReviewDto.from_db(reviews[i], base_url, f"Review {i + 1}"))
        return review_dtos


class ReviewFeedbackDto():
    def __init__(self, constructiveness: int, specificity: int, justification: int, politeness: int, feedback: str):
        self.constructiveness = constructiveness
        self.specificity = specificity
        self.justification = justification
        self.politeness = politeness
        self.feedback = feedback

    @staticmethod
    def sanitise_feedback(user: User, feedback: str):
        for name in [user.username, user.first_name, user.surname]:
            regex = re.compile(name, re.IGNORECASE)
        return regex.sub("Anonymous", feedback)

    @staticmethod
    def from_db(review_feedback: ReviewFeedback):
        rf = review_feedback
        return ReviewFeedbackDto(rf.constructiveness, rf.specificity, rf.justification, rf.politeness,
                                 ReviewFeedbackDto.sanitise_feedback(rf.get_submitter(), rf.feedback))


class CommentDto():
    def __init__(self, id: str, author_pseudonym: str, contents: str, line_number: int, replies: List, is_author: bool):
        self.id = id
        self.author_pseudonym = author_pseudonym
        self.contents = contents
        self.line_number = line_number
        self.replies = replies
        self.is_author = is_author

    @staticmethod
    def from_comment(comment: Comment, author: User=None):
        if author == None:
            author = get_active_user()

            if author == None:
                return None

        replies = [CommentDto.from_comment(reply, author) for reply in comment.replies]
        is_author = author == comment.get_author_user()
        return CommentDto(str(comment.id), comment.author.name, comment.contents, comment.line_number, replies,
                          is_author)


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