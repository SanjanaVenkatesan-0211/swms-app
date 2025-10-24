from flask import Blueprint, request, jsonify
from models.citizen_requests import get_citizen_requests, create_citizen_request

citizen_requests_bp = Blueprint("citizen_requests", __name__)

# -------------------------------
# Get all requests for a citizen
# -------------------------------
@citizen_requests_bp.route("/<citizen_id>", methods=["GET"])
def fetch_requests(citizen_id):
    requests_list = get_citizen_requests(citizen_id)

    # Convert Mongo ObjectId to string for JSON
    for r in requests_list:
        if "_id" in r:
            r["_id"] = str(r["_id"])
    
    return jsonify(requests_list), 200


# -------------------------------
# Create new request
# -------------------------------
@citizen_requests_bp.route("/create", methods=["POST"])
def add_request():
    data = request.get_json()
    citizen_id = data.get("citizen_id")
    location = data.get("location")
    waste_type = data.get("waste_type")
    
    if not citizen_id or not location or not waste_type:
        return jsonify({"error": "All fields are required"}), 400
    
    req = create_citizen_request(citizen_id, location, waste_type)

    # Convert _id to string
    if "_id" in req:
        req["_id"] = str(req["_id"])

    return jsonify({"message": "Request submitted!", "request": req}), 201

