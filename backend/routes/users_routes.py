from flask import Blueprint, request, jsonify
from models.users import create_user, find_user_by_username, verify_user

# Create a blueprint for user routes
users_bp = Blueprint("users", __name__)

# -----------------------------
# REGISTER USER
# -----------------------------
@users_bp.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        result = create_user(data)  # call old users.py function

        # If create_user returned an error, send it to frontend
        if "error" in result:
            return jsonify(result), 400

        # Success
        return jsonify({
            "message": result.get("message"),
            "role": data.get("role", "citizen")  # default role citizen
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -----------------------------
# LOGIN USER
# -----------------------------
@users_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return jsonify({"error": "Username and password are required"}), 400

        if verify_user(username, password):  # call old users.py function
            user = find_user_by_username(username)
            role = user.get("role", "citizen")  # get role from DB (default citizen)
            return jsonify({
                "message": "Login successful",
                "role": role,
                "username": username
            }), 200
        else:
            return jsonify({"error": "Invalid username or password"}), 401

    except Exception as e:
        return jsonify({"error": str(e)}), 500
