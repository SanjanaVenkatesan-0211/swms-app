from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["swms_db"]
yards_collection = db["yards"]

def get_all_yards():
    """Return all yards"""
    return list(yards_collection.find({}, {"_id": 0}))
