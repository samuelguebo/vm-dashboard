from flask import Flask, Blueprint, jsonify
from services.phabricator_api import PhabricatorApi
from config import Config

"""
A collection of endpoints displaying JSON results
related to the Asana API tasks
"""

api_bp = Blueprint("api_bp", __name__)
display_limit = 5

@api_bp.route("/api/tasks/phabricator")
def phabricator_tasks():
    """
    Collect tasks through the webservice
    and render them as JSON
    """
    
    tasks = PhabricatorApi().get_tasks_as_json(display_limit)
    return jsonify(tasks)


@api_bp.route("/api/info")
def server_info():
    """
    Utility endpoint printing
    server information
    """
    
    info = {"phabricator_url": Config.PHABRICATOR_URI.replace("/api/", "")}
    return jsonify(info)
