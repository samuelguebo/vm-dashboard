import os
from decouple import config


class Config(object):
    """
    Set of configurations that will be
    used across the application
    """

    TITLE = config("TITLE")
    DESCRIPTION = config("DESCRIPTION")
    PHABRICATOR_KEY = config("PHABRICATOR_KEY")
    PHABRICATOR_URI = config("PHABRICATOR_URI")
    PHABRICATOR_TAG_PREFIX = config("PHABRICATOR_TAG_PREFIX")
    CACHE_DEFAULT_TIMEOUT = config("CACHE_DEFAULT_TIMEOUT")
    ROOT_FOLDER = os.path.dirname(os.path.abspath(__file__))
