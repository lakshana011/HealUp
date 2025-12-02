"""Appointment routes."""
from flask import Blueprint, request, jsonify
from datetime import datetime
from bson import ObjectId
from database import appointments_col, doctors_col, users_col
from utils import require_auth, require_role, serialize

appointments_bp = Blueprint("appointments", __name__)


@appointments_bp.get("")
def get_appointments():
    """Admin/debug: list all appointments."""
    user = require_auth()
    ok, resp = require_role(user, "admin")
    if not ok:
        return resp

    items = [serialize(a) for a in appointments_col.find()]
    return jsonify(items)


@appointments_bp.get("/<appointment_id>")
def get_appointment(appointment_id):
    """Get a specific appointment."""
    user = require_auth()
    if not user:
        return jsonify({"success": False, "message": "Not authenticated"}), 401

    apt = appointments_col.find_one({"_id": ObjectId(appointment_id)})
    if not apt:
        return jsonify({"message": "Appointment not found"}), 404

    # Check permissions
    if user["role"] == "patient" and apt.get("patientId") != str(user["_id"]):
        return jsonify({"success": False, "message": "Forbidden"}), 403
    if user["role"] == "doctor":
        doc = doctors_col.find_one({"userId": str(user["_id"])})
        if doc and apt.get("doctorId") != str(doc["_id"]):
            return jsonify({"success": False, "message": "Forbidden"}), 403

    return jsonify(serialize(apt))


@appointments_bp.get("/patient/<patient_id>")
def get_patient_appointments(patient_id):
    """Get appointments for a patient."""
    user = require_auth()
    if not user:
        return jsonify({"success": False, "message": "Not authenticated"}), 401

    if user["role"] == "patient" and str(user["_id"]) != patient_id:
        return jsonify({"success": False, "message": "Forbidden"}), 403

    items = [serialize(a) for a in appointments_col.find({"patientId": patient_id})]
    return jsonify(items)


@appointments_bp.get("/doctor/<doctor_id>")
def get_doctor_appointments(doctor_id):
    """Get appointments for a doctor."""
    user = require_auth()
    if not user:
        return jsonify({"success": False, "message": "Not authenticated"}), 401

    if user["role"] == "doctor":
        doc = doctors_col.find_one({"userId": str(user["_id"])})
        if doc and str(doc["_id"]) != doctor_id:
            return jsonify({"success": False, "message": "Forbidden"}), 403

    items = [serialize(a) for a in appointments_col.find({"doctorId": doctor_id})]
    return jsonify(items)


@appointments_bp.get("/me")
def get_my_appointments():
    """Convenience endpoint: return appointments for the current user."""
    user = require_auth()
    if not user:
        return jsonify({"success": False, "message": "Not authenticated"}), 401

    user_id = str(user["_id"])
    role = user["role"]

    if role == "patient":
        items = [serialize(a) for a in appointments_col.find({"patientId": user_id})]
    elif role == "doctor":
        doc = doctors_col.find_one({"userId": user_id})
        if doc:
            items = [serialize(a) for a in appointments_col.find({"doctorId": str(doc["_id"])})]
        else:
            items = []
    else:
        items = [serialize(a) for a in appointments_col.find()]

    return jsonify(items)


@appointments_bp.post("")
def book_appointment():
    """Book a new appointment."""
    data = request.json or {}
    required = ["patientId", "doctorId", "date", "time", "type"]
    if not all(k in data for k in required):
        return jsonify({"success": False, "message": "Missing fields"}), 400

    user = require_auth()
    if not user:
        return jsonify({"success": False, "message": "Not authenticated"}), 401

    # Enforce that the caller is the patient who is booking
    if user["role"] == "patient" and data["patientId"] != str(user["_id"]):
        return jsonify({"success": False, "message": "Cannot book for another patient"}), 403

    # Prevent double booking
    existing = appointments_col.find_one({
        "doctorId": data["doctorId"],
        "date": data["date"],
        "time": data["time"],
        "status": {"$ne": "cancelled"},
    })
    if existing:
        return jsonify({"success": False, "message": "Slot already booked"}), 409

    # Fetch doctor and patient names for the appointment
    doctor = doctors_col.find_one({"_id": ObjectId(data["doctorId"])})
    patient_user = users_col.find_one({"_id": ObjectId(data["patientId"])})

    doctor_name = doctor.get("name", "Unknown Doctor") if doctor else "Unknown Doctor"
    patient_name = patient_user.get("name", "Unknown Patient") if patient_user else "Unknown Patient"
    specialty = doctor.get("specialty", "") if doctor else ""

    apt = {
        "patientId": data["patientId"],
        "patientName": patient_name,
        "doctorId": data["doctorId"],
        "doctorName": doctor_name,
        "specialty": specialty,
        "date": data["date"],
        "time": data["time"],
        "type": data["type"],
        "notes": data.get("notes"),
        "status": "pending",
        "created_at": datetime.utcnow(),
    }
    res = appointments_col.insert_one(apt)
    apt["_id"] = res.inserted_id
    return jsonify({"success": True, "appointment": serialize(apt)})


@appointments_bp.put("/<appointment_id>/cancel")
def cancel_appointment(appointment_id):
    """Cancel an appointment."""
    user = require_auth()
    if not user:
        return jsonify({"success": False, "message": "Not authenticated"}), 401

    apt = appointments_col.find_one({"_id": ObjectId(appointment_id)})
    if not apt:
        return jsonify({"success": False, "message": "Appointment not found"}), 404

    # Patients can cancel their own, doctors/admin can cancel any
    if user["role"] == "patient" and apt.get("patientId") != str(user["_id"]):
        return jsonify({"success": False, "message": "Forbidden"}), 403

    appointments_col.update_one(
        {"_id": ObjectId(appointment_id)},
        {"$set": {"status": "cancelled"}},
    )
    return jsonify({"success": True})


@appointments_bp.put("/<appointment_id>/complete")
def complete_appointment(appointment_id):
    """Mark an appointment as completed (doctor/admin only)."""
    user = require_auth()
    ok, resp = require_role(user, "doctor", "admin")
    if not ok:
        return resp

    appointments_col.update_one(
        {"_id": ObjectId(appointment_id)},
        {"$set": {"status": "completed"}},
    )
    return jsonify({"success": True})

