from pymongo import MongoClient
import bcrypt

# MongoDB setup
client = MongoClient("mongodb://localhost:27017/")
db = client["swms_db"]
users_collection = db["users"]

# ---------------------------
# User database functions
# ---------------------------

def create_user(data):
    """Create a new user with hashed password."""
    if users_collection.find_one({"username": data["username"]}):
        return {"error": "Username already exists"}

    # Hash password before storing
    hashed_password = bcrypt.hashpw(data["password"].encode("utf-8"), bcrypt.gensalt())
    data["password"] = hashed_password.decode("utf-8")
    users_collection.insert_one(data)
    return {"message": "User registered successfully!"}

def find_user_by_username(username):
    """Find a user document by username."""
    return users_collection.find_one({"username": username})

def verify_user(username, password):
    """Check if password matches the hashed password."""
    user = find_user_by_username(username)
    if not user:
        return False
    return bcrypt.checkpw(password.encode("utf-8"), user["password"].encode("utf-8"))
def find_all_users():
    """Return all users"""
    return list(users_collection.find({}, {"_id": 0, "password": 0}))  # hide password
def find_user_by_userid(user_id):
    """Find a user document by driver_id or user_id"""
    return users_collection.find_one({"user_id": user_id})
