from flask import Blueprint, jsonify
from models.users import find_user_by_username
from models.bins import get_all_bins
from models.collection_tasks import get_driver_tasks, get_all_tasks
from models.yards import get_all_yards
from models.trucks import get_all_trucks
from models.citizen_requests import get_citizen_requests
from models.users import find_all_users

dashboard_bp = Blueprint("dashboard", __name__)

# -----------------------------
# Citizen Dashboard
# -----------------------------
@dashboard_bp.route("/citizen/<username>", methods=["GET"])
def citizen_dashboard(username):
    user = find_user_by_username(username)
    if not user or user["role"] != "citizen":
        return jsonify({"error": "Unauthorized"}), 401

    bins = get_all_bins()                 # All bins
    requests = get_citizen_requests(user["user_id"])  # Requests by this citizen

    return jsonify({
        "username": username,
        "bins": bins,
        "requests": requests
    })

# -----------------------------
# Driver Dashboard
# -----------------------------
@dashboard_bp.route("/driver/<username>", methods=["GET"])
def driver_dashboard(username):
    user = find_user_by_username(username)
    if not user or user["role"] != "driver":
        return jsonify({"error": "Unauthorized"}), 401

    tasks = get_driver_tasks(user["user_id"])  # Tasks assigned to this driver
    return jsonify({"username": username, "tasks": tasks})

# -----------------------------
# Manager Dashboard
# -----------------------------
@dashboard_bp.route("/manager/<username>", methods=["GET"])
def manager_dashboard(username):
    user = find_user_by_username(username)
    if not user or user["role"] != "manager":
        return jsonify({"error": "Unauthorized"}), 401

    tasks = get_all_tasks()  # All tasks
    drivers = get_all_trucks()  # Get drivers from trucks collection
    return jsonify({"username": username, "tasks": tasks, "drivers": drivers})

# -----------------------------
# Facility Admin Dashboard
# -----------------------------
@dashboard_bp.route("/admin/<username>", methods=["GET"])
def admin_dashboard(username):
    user = find_user_by_username(username)
    if not user or user["role"] != "facility_admin":
        return jsonify({"error": "Unauthorized"}), 401

    yards = get_all_yards()
    trucks = get_all_trucks()
    users = find_all_users()
    return jsonify({"username": username, "yards": yards, "trucks": trucks, "users": users})
