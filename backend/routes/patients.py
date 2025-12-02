"""Patient routes."""
from flask import Blueprint, request, jsonify
from bson import ObjectId
from database import patients_col
from utils import require_auth, require_role, serialize

patients_bp = Blueprint("patients", __name__)


@patients_bp.get("")
def get_patients():
    """Get all patients (admin only)."""
    user = require_auth()
    ok, resp = require_role(user, "admin", "doctor")
    if not ok:
        return resp

    patients = [serialize(p) for p in patients_col.find()]
    return jsonify(patients)


@patients_bp.get("/<patient_id>")
def get_patient(patient_id):
    """Get a specific patient by ID."""
    user = require_auth()
    if not user:
        return jsonify({"success": False, "message": "Not authenticated"}), 401

    # Patients can only view their own profile, doctors/admin can view any
    p = patients_col.find_one({"_id": ObjectId(patient_id)})
    if not p:
        return jsonify({"message": "Patient not found"}), 404

    if user["role"] == "patient" and p.get("userId") != str(user["_id"]):
        return jsonify({"success": False, "message": "Forbidden"}), 403

    return jsonify(serialize(p))


@patients_bp.put("/<patient_id>")
def update_patient(patient_id):
    """Update patient profile."""
    user = require_auth()
    if not user:
        return jsonify({"success": False, "message": "Not authenticated"}), 401

    # Check if patient exists
    p = patients_col.find_one({"_id": ObjectId(patient_id)})
    if not p:
        return jsonify({"success": False, "message": "Patient not found"}), 404

    # Patients can only update their own profile
    if user["role"] == "patient" and p.get("userId") != str(user["_id"]):
        return jsonify({"success": False, "message": "Forbidden"}), 403

    data = request.json or {}
    # Allow updating these fields
    allowed_fields = {
        "name", "email", "phone", "age", "gender", "bloodGroup",
        "address", "medicalHistory", "emergencyContact"
    }
    update_data = {k: v for k, v in data.items() if k in allowed_fields}

    patients_col.update_one(
        {"_id": ObjectId(patient_id)},
        {"$set": update_data}
    )
    updated = patients_col.find_one({"_id": ObjectId(patient_id)})
    return jsonify({"success": True, "patient": serialize(updated)})


@patients_bp.get("/<patient_id>/prescriptions")
def get_patient_prescriptions(patient_id):
    """Get prescriptions for a patient."""
    user = require_auth()
    if not user:
        return jsonify({"success": False, "message": "Not authenticated"}), 401

    from database import prescriptions_col

    # Patients can only view their own prescriptions
    p = patients_col.find_one({"_id": ObjectId(patient_id)})
    if user["role"] == "patient" and p.get("userId") != str(user["_id"]):
        return jsonify({"success": False, "message": "Forbidden"}), 403

    prescriptions = prescriptions_col.find({"patientId": patient_id})
    return jsonify([serialize(p) for p in prescriptions])


@patients_bp.get("/<patient_id>/reports")
def get_patient_reports(patient_id):
    """Get reports for a patient."""
    user = require_auth()
    if not user:
        return jsonify({"success": False, "message": "Not authenticated"}), 401

    from database import reports_col

    # Patients can only view their own reports
    p = patients_col.find_one({"_id": ObjectId(patient_id)})
    if user["role"] == "patient" and p.get("userId") != str(user["_id"]):
        return jsonify({"success": False, "message": "Forbidden"}), 403

    reports = reports_col.find({"patientId": patient_id})
    return jsonify([serialize(r) for r in reports])

