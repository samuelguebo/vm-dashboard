from config import Config
from models.task import Task
from datetime import datetime
from phabricator import Phabricator


class PhabricatorApi:
    def __init__(self):
        self.client = Phabricator(
            host=Config.PHABRICATOR_URI,
            token=Config.PHABRICATOR_KEY,
            timeout=30,
        )

    def get_user_info(self):
        """
        Display the details about the current
        user as a dictionary
        """

        return self.client.user.whoami()

    def get_tasks(self, project_id, limit=5):
        """
        Arbitrarily narrow down to only one workspace
        :param project_id: PHID of Phabricator tag
        """
        task_list = []

        tasks = self.client.maniphest.search(
            queryKey="all", constraints={"projects": [project_id]}, limit=limit
        )["data"]

        # Parse JSON into Task objects
        for task in tasks:
            task_list.append(
                Task(
                    task["id"],
                    task["fields"]["name"],
                    "{}".format(Config.PHABRICATOR_URI.replace("/api/", ""))
                    + "/T"
                    + str(task["id"]),
                    ("Completed" == task["fields"]["status"]["value"]),
                    datetime.strftime(
                        datetime.fromtimestamp(task["fields"]["dateCreated"]),
                        "%Y-%m-%d %H:%m:%S",
                    ),
                    task["fields"]["priority"]["value"],
                )
            )

        return task_list

    def get_tasks_as_json(self, tasks):
        """
        Serialize a list tasks into JSON format
        :param tasks: array of tasks
        """

        tasks = [
            {
                "id": "T{}".format(task.id),
                "title": task.title,
                "link": task.link,
                "created_at": task.created_at,
                "is_completed": task.is_completed,
                "priority": task.priority,
            }
            for task in tasks
        ]

        return tasks

    def find_tags_by_term(self, tag_prefix):
        """
        Collect an array of Phabricator tags
        along with their relevant details

        :param tag_prefix: The tags prefix
        """
        tags = []
        tags = self.client.project.search(
            queryKey="all",
            constraints={"name": tag_prefix},
        )["data"]

        return tags

    def get_tasks_by_tags(self, tags, limit=5):
        """
        Collect a number of tasks from an list of tags

        :param tags: a list of tag IDs
        :param limit: how many tasks to collect
        """
        tasks = []
        for tag in tags:
            # concatenate list of tasks
            tasks += self.get_tasks(tag["phid"], limit)

        return tasks