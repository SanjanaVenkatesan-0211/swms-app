from pymongo import MongoClient
from datetime import datetime

client = MongoClient("mongodb://localhost:27017/")
db = client["swms_db"]
requests_collection = db["citizen_requests"]

def get_citizen_requests(citizen_id):
    """Return requests submitted by a citizen"""
    return list(requests_collection.find({"citizen_id": citizen_id}, {"_id": 0}))

def create_citizen_request(citizen_id, location, waste_type):
    """Create a new pickup request"""
    request = {
        "request_id": f"R{int(datetime.now().timestamp())}",  # unique ID
        "citizen_id": citizen_id,
        "location": location,
        "waste_type": waste_type,
        "status": "pending",
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    requests_collection.insert_one(request)
    return request
def get_all_pending_requests():
    """Return all requests with status 'pending'"""
    requests = list(requests_collection.find({"status": "pending"}))
    for r in requests:
        r["_id"] = str(r["_id"])
    return requests