from flask import Flask
from flask_cors import CORS
from routes.users_routes import users_bp
from routes.dashboard_routes import dashboard_bp
from routes.citizen_requests_routes import citizen_requests_bp
from routes.driver_routes import driver_bp
from routes.manager_routes import manager_bp
from routes.facility_admin_routes import facility_bp





app = Flask(__name__)
CORS(app)  # Enable cross-origin requests for React frontend

# Register blueprints
app.register_blueprint(users_bp, url_prefix="/api/users")
app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")
app.register_blueprint(citizen_requests_bp, url_prefix="/api/requests")
app.register_blueprint(driver_bp, url_prefix="/api/driver")
app.register_blueprint(manager_bp, url_prefix="/api/manager")
app.register_blueprint(facility_bp, url_prefix="/api/facility")
# Optional home route
@app.route("/")
def home():
    return {"message": "Welcome to SWMS backend!"}

if __name__ == "__main__":
    app.run(debug=True)
