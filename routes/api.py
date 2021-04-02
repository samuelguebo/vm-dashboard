from flask import Flask, Blueprint, jsonify
from services.phabricator_api import PhabricatorApi
from flask_api_cache import ApiCache
from config import Config

"""
A collection of endpoints displaying JSON results
related to the Asana API tasks
"""

api_bp = Blueprint("api_bp", __name__)
display_limit = 5


@api_bp.route("/api/tasks/phabricator")
@ApiCache(expired_time=int(Config.CACHE_DEFAULT_TIMEOUT))
def phabricator_tasks():
    """
    Collect tasks through the services
    and render them as JSON
    """
    tasks = []
    phab = PhabricatorApi()
    projects = phab.find_projects_by_term(Config.PHABRICATOR_TAG_PREFIX)
    tasks = phab.get_tasks_by_projects(projects, display_limit)
    output = phab.get_tasks_as_json(tasks)

    return jsonify(output)


@api_bp.route("/api/info")
def server_info():
    """
    Utility endpoint printing
    server information
    """

    info = {"phabricator_url": Config.PHABRICATOR_URI.replace("/api/", "")}
    return jsonify(info)
