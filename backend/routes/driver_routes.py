from flask import Blueprint, jsonify, request
from models.collection_tasks import get_driver_tasks, complete_task

driver_bp = Blueprint("driver", __name__)

# Fetch all tasks for a driver

@driver_bp.route("/<driver_id>", methods=["GET"])
def fetch_driver_tasks(driver_id):
    print("📦 Received driver_id:", driver_id)
    tasks = get_driver_tasks(driver_id)
    print("✅ Found tasks:", tasks)
    return jsonify(tasks), 200

# Mark a task as completed
@driver_bp.route("/complete/<task_id>", methods=["PUT"])
def mark_task_complete(task_id):
    success = complete_task(task_id)
    if success:
        return jsonify({"message": "Task marked as completed!"}), 200
    return jsonify({"error": "Task not found"}), 404
