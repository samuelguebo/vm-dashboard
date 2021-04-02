# VM Dashboard
A dashboard providing a statistical analysis of security vulnerabilities across Wikimedia projects.

## Requirements
* [Python 3.5+](https://www.python.org/downloads/)
* [PIP (Python Dependency Manager)](https://pip.pypa.io/en/stable/installing/)

## Install dependencies
Install relevant dependencies with `pip install -r requirements.txt`.

## Set environment variables
Rename the `.env.example` file into `.env` and modify it according to your Asana and Phabricator API keys and related configurations.

## Quickstart the app
Once the dependencies and configurations are in place, start the app by running `python app.py`. 

The app should be live on port 5000: `http://127.0.0.1:5000/`

## Unit and Integration tests
The script comes with a set of tests under the `tests` folder.
You can run them with pytest using `pytest tests/`