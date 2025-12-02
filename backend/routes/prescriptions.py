"""Prescription and report routes."""
from flask import Blueprint, request, jsonify
from datetime import datetime
from bson import ObjectId
from database import prescriptions_col, reports_col, patients_col
from utils import require_auth, require_role, serialize

prescriptions_bp = Blueprint("prescriptions", __name__)


@prescriptions_bp.post("")
def create_prescription():
    """Doctor creates a prescription record."""
    user = require_auth()
    ok, resp = require_role(user, "doctor")
    if not ok:
        return resp

    data = request.json or {}
    required = ["patientId", "diagnosis", "medicines"]
    if not all(k in data for k in required):
        return jsonify({"success": False, "message": "Missing fields"}), 400

    prescription = {
        "patientId": data["patientId"],
        "doctorId": str(user["_id"]),
        "diagnosis": data["diagnosis"],
        "date": data.get("date") or datetime.utcnow().strftime("%Y-%m-%d"),
        "medicines": data.get("medicines", []),
        "fileUrl": data.get("fileUrl"),
        "notes": data.get("notes"),
        "created_at": datetime.utcnow(),
    }
    res = prescriptions_col.insert_one(prescription)
    prescription["_id"] = res.inserted_id
    return jsonify({"success": True, "prescription": serialize(prescription)})


@prescriptions_bp.get("/<prescription_id>/download")
def download_prescription(prescription_id):
    """Download prescription file (if fileUrl exists)."""
    user = require_auth()
    if not user:
        return jsonify({"success": False, "message": "Not authenticated"}), 401

    prescription = prescriptions_col.find_one({"_id": ObjectId(prescription_id)})
    if not prescription:
        return jsonify({"success": False, "message": "Prescription not found"}), 404

    # Check permissions
    if user["role"] == "patient":
        p = patients_col.find_one({"userId": str(user["_id"])})
        if p and prescription.get("patientId") != str(p["_id"]):
            return jsonify({"success": False, "message": "Forbidden"}), 403

    file_url = prescription.get("fileUrl")
    if not file_url:
        return jsonify({"success": False, "message": "No file available"}), 404

    return jsonify({"success": True, "fileUrl": file_url})


@prescriptions_bp.post("/reports")
def create_report():
    """Create a medical report record (doctor/admin)."""
    user = require_auth()
    ok, resp = require_role(user, "doctor", "admin")
    if not ok:
        return resp

    data = request.json or {}
    required = ["patientId", "name", "type"]
    if not all(k in data for k in required):
        return jsonify({"success": False, "message": "Missing fields"}), 400

    report = {
        "patientId": data["patientId"],
        "doctorId": str(user["_id"]),
        "name": data["name"],
        "type": data["type"],
        "date": data.get("date") or datetime.utcnow().strftime("%Y-%m-%d"),
        "fileUrl": data.get("fileUrl"),
        "notes": data.get("notes"),
        "created_at": datetime.utcnow(),
    }
    res = reports_col.insert_one(report)
    report["_id"] = res.inserted_id
    return jsonify({"success": True, "report": serialize(report)})


@prescriptions_bp.get("/reports/<report_id>/download")
def download_report(report_id):
    """Download report file (if fileUrl exists)."""
    user = require_auth()
    if not user:
        return jsonify({"success": False, "message": "Not authenticated"}), 401

    report = reports_col.find_one({"_id": ObjectId(report_id)})
    if not report:
        return jsonify({"success": False, "message": "Report not found"}), 404

    # Check permissions
    if user["role"] == "patient":
        p = patients_col.find_one({"userId": str(user["_id"])})
        if p and report.get("patientId") != str(p["_id"]):
            return jsonify({"success": False, "message": "Forbidden"}), 403

    file_url = report.get("fileUrl")
    if not file_url:
        return jsonify({"success": False, "message": "No file available"}), 404

    return jsonify({"success": True, "fileUrl": file_url})

