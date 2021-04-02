import pytest
from flask import Flask
from config import Config
import json
from routes import api


"""
Test suite for the rest API endpoints
which are used on the front-end
"""


@pytest.fixture
def client():
    app = Flask(__name__)
    app.config.from_object(Config)

    testing_client = app.test_client()

    # Establish an application context before running the tests.
    ctx = app.app_context()
    ctx.push()

    yield testing_client  # this is where the testing happens!

    ctx.pop()


def test_phabricator_route(client):
    """
    Testing the route /api/tasks/phabricator
    """
    resp = api.phabricator_tasks()
    data = json.loads(resp.data)[0]

    print(data)

    assert len(data) > 0
