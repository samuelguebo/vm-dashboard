from config import Config
from flask import Flask, Blueprint, render_template, jsonify, make_response

"""
A collection of endpoints displaying JSON results
related to the home page
"""
home_bp = Blueprint("home_bp", __name__)


@home_bp.route("/static/<path:path>")
def static_dir(path):
    """
    Serves static files such as
    Css, JavaScript, or images
    """

    return send_from_directory("static", path)


@home_bp.route("/")
def home():
    """
    Displays some HTML on the front end
    using a template file
    """

    return render_template(
        "index.html", title=Config.TITLE, description=Config.DESCRIPTION
    )