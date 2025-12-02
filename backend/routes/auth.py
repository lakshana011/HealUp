"""Authentication routes."""
from flask import Blueprint, request, jsonify
from datetime import datetime
from bson import ObjectId
from database import users_col, doctors_col, patients_col
from utils import hash_password, create_token, require_auth, serialize, check_password

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/signup")
def signup():
    """Register a new user (patient or doctor)."""
    data = request.json or {}
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "patient")

    if not all([name, email, password]):
        return jsonify({"success": False, "message": "Missing fields"}), 400

    if users_col.find_one({"email": email}):
        return jsonify({"success": False, "message": "Email already registered"}), 400

    pw_hash = hash_password(password)
    user_doc = {
        "name": name,
        "email": email,
        "password_hash": pw_hash,
        "role": role,
        "created_at": datetime.utcnow(),
    }
    res = users_col.insert_one(user_doc)
    user_doc["_id"] = res.inserted_id
    user_id_str = str(user_doc["_id"])

    # Create profile based on role
    try:
        if role == "doctor":
            doctor_result = doctors_col.insert_one({
                "userId": user_id_str,
                "name": name,
                "specialty": "General Physician",
                "experience": 0,
                "rating": 5.0,
                "reviews": 0,
                "image": "https://images.unsplash.com/photo-1535916707207-35f97e715e1b?w=400",
                "bio": "Dedicated to providing comprehensive healthcare.",
                "education": "MBBS",
                "availableSlots": ["09:00", "10:00", "11:00", "14:00", "15:00"],
                "consultationFee": 500,
                "created_at": datetime.utcnow(),
            })
            print(f"Doctor profile created with ID: {doctor_result.inserted_id}")
        elif role == "patient":
            patient_result = patients_col.insert_one({
                "userId": user_id_str,
                "name": name,
                "email": email,
                "phone": "",
                "age": None,
                "gender": "",
                "bloodGroup": "",
                "address": "",
                "medicalHistory": "",
                "emergencyContact": "",
                "created_at": datetime.utcnow(),
            })
            print(f"Patient profile created with ID: {patient_result.inserted_id}")
    except Exception as e:
        print(f"Error creating profile: {e}")
        # Don't fail signup if profile creation fails, but log it

    token = create_token(user_doc)

    return jsonify({
        "success": True,
        "user": {
            "id": user_id_str,
            "name": user_doc["name"],
            "email": user_doc["email"],
            "role": user_doc["role"],
        },
        "token": token,
    })


@auth_bp.post("/login")
def login():
    """Login and return JWT token."""
    data = request.json or {}
    email = data.get("email")
    password = data.get("password")

    if not all([email, password]):
        return jsonify({"success": False, "message": "Missing email or password"}), 400

    user = users_col.find_one({"email": email})
    if not user or not check_password(password, user["password_hash"]):
        return jsonify({"success": False, "message": "Invalid credentials"}), 401

    token = create_token(user)
    return jsonify({
        "success": True,
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "role": user["role"],
        },
        "token": token,
    })


@auth_bp.get("/me")
def me():
    """Get current authenticated user and their profile."""
    user = require_auth()
    if not user:
        return jsonify({"success": False, "message": "Not authenticated"}), 401

    user_id = str(user["_id"])
    doctor_profile = doctors_col.find_one({"userId": user_id})
    patient_profile = patients_col.find_one({"userId": user_id})

    response = {
        "success": True,
        "user": {
            "id": user_id,
            "name": user["name"],
            "email": user["email"],
            "role": user["role"],
        },
    }

    if doctor_profile:
        response["doctorProfile"] = serialize(doctor_profile)
    if patient_profile:
        response["patientProfile"] = serialize(patient_profile)

    return jsonify(response)

