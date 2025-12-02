"""Doctor routes."""
from flask import Blueprint, request, jsonify
from bson import ObjectId
from database import doctors_col, availability_col
from utils import require_auth, require_role, serialize

doctors_bp = Blueprint("doctors", __name__)


@doctors_bp.get("")
def get_doctors():
    """Get all doctors, optionally filtered by specialty or search query."""
    specialty = request.args.get("specialty")
    query = request.args.get("q")

    filters = {}
    if specialty and specialty != "all":
        filters["specialty"] = specialty
    if query:
        filters["$or"] = [
            {"name": {"$regex": query, "$options": "i"}},
            {"specialty": {"$regex": query, "$options": "i"}},
        ]

    doctors = [serialize(d) for d in doctors_col.find(filters)]
    return jsonify(doctors)


@doctors_bp.get("/me")
def get_my_doctor_profile():
    """Return the logged-in doctor's profile."""
    user = require_auth()
    ok, resp = require_role(user, "doctor")
    if not ok:
        return resp

    doc = doctors_col.find_one({"userId": str(user["_id"])})
    if not doc:
        return jsonify({"message": "Doctor profile not found"}), 404
    return jsonify(serialize(doc))


@doctors_bp.put("/me")
def update_my_doctor_profile():
    """Allow a doctor to update their own profile fields."""
    user = require_auth()
    ok, resp = require_role(user, "doctor")
    if not ok:
        return resp

    data = request.json or {}
    allowed_fields = {
        "name",
        "specialty",
        "experience",
        "consultationFee",
        "image",
        "bio",
        "education",
    }
    update_data = {k: v for k, v in data.items() if k in allowed_fields}
    if not update_data:
        return jsonify({"success": False, "message": "No valid fields to update"}), 400

    res = doctors_col.update_one(
        {"userId": str(user["_id"])},
        {"$set": update_data},
    )
    if res.matched_count == 0:
        return jsonify({"success": False, "message": "Doctor profile not found"}), 404

    doc = doctors_col.find_one({"userId": str(user["_id"])})
    return jsonify({"success": True, "doctor": serialize(doc)})


@doctors_bp.get("/<doctor_id>")
def get_doctor(doctor_id):
    """Get a specific doctor by ID."""
    doc = doctors_col.find_one({"_id": ObjectId(doctor_id)})
    if not doc:
        return jsonify({"message": "Doctor not found"}), 404
    return jsonify(serialize(doc))


@doctors_bp.get("/<doctor_id>/availability")
def get_doctor_availability(doctor_id):
    """Get availability for a doctor."""
    avail = list(availability_col.find({"doctorId": doctor_id}))
    return jsonify([serialize(a) for a in avail])


@doctors_bp.post("/<doctor_id>/availability")
def set_doctor_availability(doctor_id):
    """Set availability for a doctor (date + slots)."""
    user = require_auth()
    ok, resp = require_role(user, "doctor")
    if not ok:
        return resp

    # Ensure doctor can only set their own availability
    doc = doctors_col.find_one({"_id": ObjectId(doctor_id)})
    if not doc or doc.get("userId") != str(user["_id"]):
        return jsonify({"success": False, "message": "Forbidden"}), 403

    data = request.json or {}
    date = data.get("date")
    slots = data.get("slots", [])

    if not date:
        return jsonify({"success": False, "message": "Missing date"}), 400

    availability_col.update_one(
        {"doctorId": doctor_id, "date": date},
        {"$set": {"doctorId": doctor_id, "date": date, "slots": slots}},
        upsert=True,
    )
    return jsonify({"success": True})


@doctors_bp.get("/<doctor_id>/slots")
def get_doctor_slots(doctor_id):
    """Return available time slots for a given doctor and date."""
    date = request.args.get("date")

    if date:
        availability = availability_col.find_one({"doctorId": doctor_id, "date": date})
        if availability:
            return jsonify(availability.get("slots", []))

    # Fallback to basic slots on doctor document if no date-specific record
    doc = doctors_col.find_one({"_id": ObjectId(doctor_id)})
    if not doc:
        return jsonify([])
    return jsonify(doc.get("availableSlots", []))

