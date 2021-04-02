from services.phabricator_api import PhabricatorApi
from config import Config


class TestPhabricator:
    """
    Test suite for operations related to the
    Phabricator API
    """

    phab = PhabricatorApi()

    """def test_get_user_info(self):
        user = self.phab.get_user_info()
        print(user)

        assert "phid" in user

    def test_get_phids(self):
        tags = self.phab.find_tags_by_term(Config.PHABRICATOR_TAG_PREFIX)
        print(tags)

        assert len(tags) > 1"""

    def test_get_tasks_by_tag(self):
        tags = self.phab.find_tags_by_term(Config.PHABRICATOR_TAG_PREFIX)
        tasks = self.phab.get_tasks_by_tags(tags)
        print(tasks[:10])
        print(
            "There are {} tasks collected across {} tags.".format(len(tasks), len(tags))
        )

        assert type(tasks) is list and len(tasks) > 0
