class Project:
    """
    Abstract data model providing a unified way to represent
    projects fetched from various providers
    """

    def __init__(self, id, title, description, link):
        self.id = id
        self.title = title
        self.description = description
        self.link = link

    def __repr__(self):
        return "<Project {} | {} | {} | {}>".format(
            self.id, self.title, self.description, self.link
        )

    def as_map(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "link": self.link,
        }