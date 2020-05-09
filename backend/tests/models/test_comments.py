from typing import List

from ..fixtures import *
from ... import Comment, Review, Repo, File, AnonUser
from ...db.api_models import CommentDto, CommentListDto


def create_review(authed_user: User):
    repo = Repo(name="Test Repo", owner_id=authed_user.id)
    repo.save()

    review = Review(repo_id=repo.id, submitter_id=authed_user.id)
    review.save()

    file = File(repo_id=repo.id, file_path="/test/file/path")
    file.save()

    anon_user = AnonUser(user_id=authed_user.id, review_id=review.id, name="Anonymous1")
    anon_user.save()

    return review, file, anon_user


def test_can_retrieve_nested_comments(db, authed_user):
    review, file, anon_user = create_review(authed_user)

    def gen_comments(number, parent_id) -> List[Comment]:
        comments = []

        for i in range(0, number):
            comments.append(Comment(review_id=review.id, file_id=file.id, author_id=anon_user.id, line_number=i,
                                    parent_id=parent_id))
            comments[i].save()

        return comments

    comments1 = gen_comments(3, None)
    comments2 = gen_comments(2, comments1[1].id)
    comments3 = gen_comments(1, comments2[0].id)

    dtos = CommentListDto.from_comments_nested(comments1)

    assert len(dtos.comments) == 3
    assert len(dtos.comments[1].replies) == 2
    assert len(dtos.comments[1].replies[0].replies) == 1

    for i in range(0, len(dtos.comments[1].replies)):
        reply = dtos.comments[1].replies[i]
        assert reply.id == str(comments2[i].id)


