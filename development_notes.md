# SQLAlchemy

## Creating and Querying

When you have a relationship defined on a model. Like `owner_id = ...foreign_key` and `owner = ...relationship`, you initialise a row by specifying the foreign key, not the relationship. Like so: `ReviewerPool(..., owner_id=...)`. 