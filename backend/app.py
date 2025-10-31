from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import datetime
import logging

# --------------------------
# Load environment variables
# --------------------------
load_dotenv()

app = Flask(__name__)
CORS(app)

# --------------------------
# ⚙️ SETUP LOGGING
# --------------------------
logging.basicConfig(
    filename='app.log',
    level=logging.INFO,
    format='%(asctime)s %(levelname)s: %(message)s'
)

# --------------------------
# 🗄️ DATABASE CONNECTION
# --------------------------
try:
    MONGO_URI = os.getenv("MONGO_URI")
    client = MongoClient(MONGO_URI)
    db = client["get_involved_db"]

    volunteer_collection = db["volunteers"]
    partner_collection = db["partners"]

    logging.info("✅ Connected to MongoDB successfully")
except Exception as e:
    logging.error(f"❌ MongoDB Connection Error: {e}")
    raise e

# --------------------------
# 🏠 HOME ROUTE
# --------------------------
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "running",
        "message": "Welcome to the Get Involved API (Flask + MongoDB)"
    }), 200

# --------------------------
# 🤝 VOLUNTEER FORM ROUTE
# --------------------------
@app.route("/api/volunteer", methods=["POST"])
def save_volunteer():
    try:
        data = request.get_json(force=True)
        required_fields = ["fullName", "email", "phone", "interest"]

        for field in required_fields:
            if not data.get(field):
                return jsonify({"error": f"Missing field: {field}"}), 400

        data["timestamp"] = datetime.datetime.utcnow()
        result = volunteer_collection.insert_one(data)
        logging.info(f"Volunteer added with ID: {result.inserted_id}")

        return jsonify({
            "success": True,
            "message": "Volunteer form submitted successfully",
            "id": str(result.inserted_id)
        }), 201

    except Exception as e:
        logging.error(f"Error saving volunteer: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

# --------------------------
# 🤝 PARTNER FORM ROUTE
# --------------------------
@app.route("/api/partner", methods=["POST"])
def save_partner():
    try:
        data = request.get_json(force=True)
        required_fields = ["organization", "contactPerson", "email", "phone", "partnershipType"]

        for field in required_fields:
            if not data.get(field):
                return jsonify({"error": f"Missing field: {field}"}), 400

        data["timestamp"] = datetime.datetime.utcnow()
        result = partner_collection.insert_one(data)
        logging.info(f"Partner added with ID: {result.inserted_id}")

        return jsonify({
            "success": True,
            "message": "Partner form submitted successfully",
            "id": str(result.inserted_id)
        }), 201

    except Exception as e:
        logging.error(f"Error saving partner: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

# --------------------------
# 🧾 VIEW DATA (ADMIN)
# --------------------------
@app.route("/api/view/<string:form_type>", methods=["GET"])
def view_data(form_type):
    try:
        if form_type == "volunteer":
            data = list(volunteer_collection.find({}, {"_id": 0}))
        elif form_type == "partner":
            data = list(partner_collection.find({}, {"_id": 0}))
        else:
            return jsonify({"error": "Invalid form type"}), 400

        return jsonify({"count": len(data), "data": data}), 200

    except Exception as e:
        logging.error(f"Error retrieving data: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

# --------------------------
# 🗑️ DELETE ENTRY
# --------------------------
@app.route("/api/delete/<string:form_type>/<string:email>", methods=["DELETE"])
def delete_entry(form_type, email):
    try:
        if form_type == "volunteer":
            result = volunteer_collection.delete_one({"email": email})
        elif form_type == "partner":
            result = partner_collection.delete_one({"email": email})
        else:
            return jsonify({"error": "Invalid form type"}), 400

        if result.deleted_count == 0:
            return jsonify({"error": "Entry not found"}), 404

        logging.info(f"Deleted {form_type} with email: {email}")
        return jsonify({"success": True, "message": "Entry deleted successfully"}), 200

    except Exception as e:
        logging.error(f"Error deleting {form_type}: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

# --------------------------
# ✏️ UPDATE ENTRY
# --------------------------
@app.route("/api/update/<string:form_type>/<string:email>", methods=["PUT"])
def update_entry(form_type, email):
    try:
        data = request.get_json(force=True)
        if form_type == "volunteer":
            result = volunteer_collection.update_one({"email": email}, {"$set": data})
        elif form_type == "partner":
            result = partner_collection.update_one({"email": email}, {"$set": data})
        else:
            return jsonify({"error": "Invalid form type"}), 400

        if result.matched_count == 0:
            return jsonify({"error": "Entry not found"}), 404

        logging.info(f"Updated {form_type} with email: {email}")
        return jsonify({"success": True, "message": "Entry updated successfully"}), 200

    except Exception as e:
        logging.error(f"Error updating {form_type}: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

# --------------------------
# 🚀 START SERVER
# --------------------------
if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
