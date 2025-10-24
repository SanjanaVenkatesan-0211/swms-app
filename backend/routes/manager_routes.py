from flask import Blueprint, jsonify
from models.collection_tasks import get_all_tasks
from models.users import find_all_users
from models.bins import get_all_bins

manager_bp = Blueprint("manager", __name__)

# Fetch all tasks
@manager_bp.route("/tasks", methods=["GET"])
def fetch_tasks():
    tasks = get_all_tasks()  # from collection_tasks.py
    return jsonify(tasks), 200

# Fetch all drivers
@manager_bp.route("/drivers", methods=["GET"])
def fetch_drivers():
    users = find_all_users()  # from users.py
    # Filter only drivers
    drivers = [u for u in users if u.get("role") == "driver"]
    return jsonify(drivers), 200

# Fetch all bins
@manager_bp.route("/bins", methods=["GET"])
def fetch_bins():
    bins = get_all_bins()  # from bins.py
    return jsonify(bins), 200
