from flask import Flask
from config import Config
from routes.home import home_bp
from routes.api import api_bp

"""
This is the main entry point 
of the application
"""
app = Flask(__name__, static_folder=Config.ROOT_FOLDER + "/static")

# Load blueprints
app.register_blueprint(home_bp)
app.register_blueprint(api_bp)

# Get the show started
app.run(port=5000, debug=True)