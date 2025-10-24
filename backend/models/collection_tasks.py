from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime

client = MongoClient("mongodb://localhost:27017/")
db = client["swms_db"]
tasks_collection = db["collection_tasks"]

# Get all tasks for a specific driver
def get_driver_tasks(driver_id):
    """
    Fetch collection tasks for a driver.
    Works whether driver_id or username is passed.
    """
    print(f"📦 Searching tasks for driver_id or username: {driver_id}")
    
    # First try matching driver_id
    tasks = list(tasks_collection.find({"driver_id": driver_id}))
    
    # If none found, try username field (fallback)
    if not tasks:
        tasks = list(tasks_collection.find({"username": driver_id}))
    
    print(f"✅ Found {len(tasks)} tasks for {driver_id}")
    
    # Convert ObjectId to string for JSON serialization
    for t in tasks:
        t["_id"] = str(t["_id"])
    
    return tasks


def get_all_tasks():
    """Return all collection tasks"""
    return list(tasks_collection.find({}, {"_id": 0}))


# Mark a task as completed
def complete_task(task_id):
    result = tasks_collection.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": {"status": "Completed"}}
    )
    return result.modified_count > 0

def create_task(driver_id, bin_id, route=""):
    """
    Create a new collection task.
    driver_id: expected to be the driver's username (e.g. 'alicej').
    """
    # create a sequential-ish task id (T001, T002, ...)
    count = tasks_collection.count_documents({})
    task_id = f"T{count + 1:03}"

    task_data = {
        "task_id": task_id,
        "driver_id": driver_id,           # <-- store username here
        "bin_id": bin_id,
        "status": "pending",
        "scheduled_time": datetime.utcnow(),
        "route": route
    }
    result = tasks_collection.insert_one(task_data)
    task_data["_id"] = str(result.inserted_id)
    return task_data
