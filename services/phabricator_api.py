from config import Config
from models.task import Task
from models.project import Project
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

    def get_tasks(self, project, limit=5):
        """
        Arbitrarily narrow down to only one workspace
        :param project_id: PHID of Phabricator project
        """
        task_list = []

        tasks = self.client.maniphest.search(
            queryKey="all", constraints={"projects": [project.id]}, limit=limit
        )["data"]

        # Parse JSON into Task objects
        for task in tasks:
            task_list.append(
                Task(
                    id=task["id"],
                    title=task["fields"]["name"],
                    link="{}".format(Config.PHABRICATOR_URI.replace("/api/", ""))
                    + "/T"
                    + str(task["id"]),
                    is_completed=("Completed" == task["fields"]["status"]["value"]),
                    created_at=datetime.strftime(
                        datetime.fromtimestamp(task["fields"]["dateCreated"]),
                        "%Y-%m-%d %H:%m:%S",
                    ),
                    priority=task["fields"]["priority"]["value"],
                    project=project,
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
                "project_id": task.project.id,
                "project_title": task.project.title,
                "project_link": task.project.link,
            }
            for task in tasks
        ]

        return tasks

    def find_projects_by_term(self, project_prefix):
        """
        Collect an array of Phabricator projects
        along with their relevant details

        :param project_prefix: The projects prefix
        """
        projects = []
        projects = self.client.project.search(
            queryKey="all",
            constraints={"name": project_prefix},
        )["data"]

        # Format JSON as proper Project objects
        projects = [
            Project(
                project["phid"],
                project["fields"]["name"],
                project["fields"]["description"],
                Config.PHABRICATOR_URI.replace("/api/", "")
                + "/maniphest/?project="
                + project["phid"],
            )
            for project in projects
        ]

        return projects

    def get_tasks_by_projects(self, projects, limit=5):
        """
        Collect a number of tasks from an list of projects

        :param projects: a list of project IDs
        :param limit: how many tasks to collect
        """
        tasks = []
        for project in projects:
            # concatenate list of tasks
            tasks += self.get_tasks(project, limit)

        return tasks