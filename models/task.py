class Task:
    """
    Abstract data model providing a unified way to represent
    tasks fetched from various providers
    """

    def __init__(self, id, title, link, is_completed, created_at):
        self.id = id
        self.title = title
        self.link = link
        self.created_at = created_at
        self.is_completed = is_completed

    def __repr__(self):
        return "<Task {} | {} | {} | {} | {}>".format(
            self.id,
            self.title,
            self.link,
            self.created_at,
            self.is_completed,
        )
