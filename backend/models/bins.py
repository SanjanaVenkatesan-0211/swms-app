from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["swms_db"]
bins_collection = db["bins"]

def get_all_bins():
    """Return all bins as a list of dicts"""
    return list(bins_collection.find({}, {"_id": 0}))  # exclude Mongo _id
