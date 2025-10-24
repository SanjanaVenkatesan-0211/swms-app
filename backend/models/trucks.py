from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["swms_db"]
trucks_collection = db["trucks"]

def get_all_trucks():
    """Return all trucks"""
    return list(trucks_collection.find({}, {"_id": 0}))
