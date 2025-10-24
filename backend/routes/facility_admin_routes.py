from flask import Blueprint, request, jsonify
from models.collection_tasks import create_task
from models.trucks import get_all_trucks
from models.bins import get_all_bins
from models.citizen_requests import get_all_pending_requests
from models.users import find_user_by_userid 

facility_bp = Blueprint("facility_admin", __name__)

@facility_bp.route("/", methods=["GET"])
def fetch_dashboard_data():
    trucks = get_all_trucks()
    bins = get_all_bins()
    requests = get_all_pending_requests()
    return jsonify({"trucks": trucks, "bins": bins, "requests": requests}), 200

@facility_bp.route("/assign", methods=["POST"])

def assign_task():
    data = request.get_json() or {}
    driver_id = data.get("driver_id")   # this comes from trucks collection
    bin_id = data.get("bin_id")
    route = data.get("route", "")

    if not driver_id or not bin_id:
        return jsonify({"error": "Driver and Bin are required"}), 400

    # Map driver_id to username
    user_doc = find_user_by_userid(driver_id)
    if not user_doc:
        return jsonify({"error": "Driver not found"}), 404

    username_to_use = user_doc["username"]

    # Store username in collection_tasks
    task = create_task(username_to_use, bin_id, route)
    return jsonify({"message": "Task assigned successfully!", "task": task}), 201
# optional: driver_status endpoint if you implemented it earlier
@facility_bp.route("/driver_status", methods=["POST"])
def update_driver_status():
    data = request.get_json() or {}
    driver_id = data.get("driver_id")
    status = data.get("status")
    if not driver_id or not status:
        return jsonify({"error": "driver_id and status required"}), 400

    from models.trucks import trucks_collection
    result = trucks_collection.update_one({"driver_id": driver_id}, {"$set": {"status": status}})
    if result.matched_count:
        return jsonify({"message": "Status updated"}), 200
    return jsonify({"error": "Driver not found"}), 404
