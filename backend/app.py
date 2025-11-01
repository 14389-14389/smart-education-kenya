from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import datetime
import logging
import uuid
from werkzeug.utils import secure_filename
from gridfs import GridFS
from bson import ObjectId
import io

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
    
    # Initialize GridFS for file storage
    fs = GridFS(db)

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
        "message": "Welcome to the Get Involved API (Flask + MongoDB)",
        "features": ["volunteers", "partners", "file_upload"]
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
        logging.error(f"Error updating ${form_type}: ${e}")
        return jsonify({"error": "Internal Server Error"}), 500

# --------------------------
# 📁 FILE UPLOAD ROUTES
# --------------------------

# Get all uploaded files
@app.route("/api/files", methods=["GET"])
def get_files():
    try:
        # Get all files from GridFS
        files = list(db.fs.files.find().sort("uploadDate", -1))
        
        # Format the response
        file_list = []
        for file in files:
            file_list.append({
                "id": str(file["_id"]),
                "name": file.get("filename", "Unknown"),
                "originalName": file.get("originalName", "Unknown"),
                "size": file.get("length", 0),
                "uploadDate": file.get("uploadDate", ""),
                "mimetype": file.get("contentType", ""),
                "url": f"/api/files/{file['_id']}"
            })
        
        return jsonify(file_list), 200
    except Exception as e:
        logging.error(f"Error fetching files: {e}")
        return jsonify({"error": "Failed to fetch files"}), 500

# Upload file
@app.route("/api/upload", methods=["POST"])
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400

        # Secure the filename and generate unique name
        original_name = secure_filename(file.filename)
        unique_name = f"{uuid.uuid4().hex}_{original_name}"
        
        # Store file in GridFS with metadata
        file_id = fs.put(
            file.stream,
            filename=unique_name,
            originalName=original_name,
            contentType=file.content_type,
            uploadDate=datetime.datetime.utcnow()
        )
        
        logging.info(f"File uploaded with ID: {file_id}, Original name: {original_name}")
        
        return jsonify({
            "success": True,
            "message": "File uploaded successfully",
            "file": {
                "id": str(file_id),
                "name": original_name,
                "url": f"/api/files/{file_id}",
                "size": fs.get(file_id).length,
                "mimetype": file.content_type
            }
        }), 201
        
    except Exception as e:
        logging.error(f"Error uploading file: {e}")
        return jsonify({"error": "File upload failed"}), 500

# Download file
@app.route("/api/files/<file_id>", methods=["GET"])
def download_file(file_id):
    try:
        # Get file from GridFS
        file_obj = fs.get(ObjectId(file_id))
        
        # Return file as download
        return send_file(
            io.BytesIO(file_obj.read()),
            download_name=file_obj.originalName,
            as_attachment=True,
            mimetype=file_obj.contentType
        )
    except Exception as e:
        logging.error(f"Error downloading file: {e}")
        return jsonify({"error": "File not found"}), 404

# Delete file
@app.route("/api/files/<file_id>", methods=["DELETE"])
def delete_file(file_id):
    try:
        # Delete file from GridFS
        fs.delete(ObjectId(file_id))
        logging.info(f"File deleted with ID: {file_id}")
        
        return jsonify({
            "success": True, 
            "message": "File deleted successfully"
        }), 200
    except Exception as e:
        logging.error(f"Error deleting file: {e}")
        return jsonify({"error": "File deletion failed"}), 500

# Get file info
@app.route("/api/files/<file_id>/info", methods=["GET"])
def get_file_info(file_id):
    try:
        file_obj = fs.get(ObjectId(file_id))
        
        return jsonify({
            "id": str(file_obj._id),
            "filename": file_obj.filename,
            "originalName": file_obj.originalName,
            "contentType": file_obj.contentType,
            "length": file_obj.length,
            "uploadDate": file_obj.uploadDate,
            "metadata": file_obj.metadata
        }), 200
    except Exception as e:
        logging.error(f"Error getting file info: {e}")
        return jsonify({"error": "File not found"}), 404

# --------------------------
# 🔍 HEALTH CHECK ROUTES (FOR LIVE DEBUGGING)
# --------------------------

@app.route("/api/health/collections", methods=["GET"])
def health_collections():
    """Check if collections exist"""
    try:
        collections = db.list_collection_names()
        has_volunteers = "volunteers" in collections
        has_partners = "partners" in collections
        
        return jsonify({
            "status": "healthy",
            "collections": collections,
            "has_volunteers_collection": has_volunteers,
            "has_partners_collection": has_partners
        }), 200
    except Exception as e:
        return jsonify({"status": "error", "error": str(e)}), 500

@app.route("/api/health/volunteers", methods=["GET"])
def health_volunteers():
    """Safe endpoint to check volunteers data without exposing details"""
    try:
        count = volunteer_collection.count_documents({})
        # Get one sample without sensitive data
        sample = volunteer_collection.find_one({}, {
            "_id": 0, 
            "email": 0, 
            "phone": 0,
            "timestamp": 0
        })
        
        return jsonify({
            "status": "healthy",
            "count": count,
            "has_data": count > 0,
            "sample_structure": sample if sample else "No data yet"
        }), 200
    except Exception as e:
        return jsonify({"status": "error", "error": str(e)}), 500

@app.route("/api/health/partners", methods=["GET"])
def health_partners():
    """Safe endpoint to check partners data without exposing details"""
    try:
        count = partner_collection.count_documents({})
        # Get one sample without sensitive data
        sample = partner_collection.find_one({}, {
            "_id": 0, 
            "email": 0, 
            "phone": 0,
            "timestamp": 0
        })
        
        return jsonify({
            "status": "healthy", 
            "count": count,
            "has_data": count > 0,
            "sample_structure": sample if sample else "No data yet"
        }), 200
    except Exception as e:
        return jsonify({"status": "error", "error": str(e)}), 500

@app.route("/api/health/test", methods=["GET"])
def health_test():
    """Simple health test"""
    try:
        return jsonify({
            "status": "healthy",
            "message": "API is running correctly",
            "timestamp": datetime.datetime.utcnow().isoformat(),
            "database": "connected" if client else "disconnected"
        }), 200
    except Exception as e:
        return jsonify({"status": "error", "error": str(e)}), 500

# --------------------------
# 🚀 START SERVER
# --------------------------
if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)