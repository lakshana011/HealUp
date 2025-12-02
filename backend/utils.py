"""Utility functions for serialization, auth, etc."""
from bson import ObjectId
from datetime import datetime, timedelta
import bcrypt
import jwt
from flask import request, jsonify
from config import JWT_SECRET, JWT_ALGO
from database import users_col


def oid(obj):
    """Convert ObjectId to string."""
    return str(obj) if isinstance(obj, ObjectId) else obj


def serialize(doc):
    """Serialize MongoDB document with both _id and id fields."""
    if not doc:
        return None
    doc_id = oid(doc.get("_id"))
    doc["_id"] = doc_id
    doc["id"] = doc_id
    return doc


def hash_password(password: str) -> bytes:
    """Hash a password using bcrypt."""
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())


def check_password(password: str, password_hash: bytes) -> bool:
    """Check if password matches hash."""
    return bcrypt.checkpw(password.encode("utf-8"), password_hash)


def create_token(user):
    """Create JWT token for user."""
    payload = {
        "sub": str(user["_id"]),
        "email": user["email"],
        "role": user["role"],
        "exp": datetime.utcnow() + timedelta(days=7),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)


def decode_token(token: str):
    """Decode JWT token."""
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGO])
    except Exception:
        return None


def require_auth():
    """Get authenticated user from Authorization header."""
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return None
    token = auth_header.split(" ", 1)[1]
    payload = decode_token(token)
    if not payload:
        return None
    user = users_col.find_one({"_id": ObjectId(payload["sub"])})
    return user


def require_role(user, *roles):
    """
    Validate that the current user has one of the allowed roles.
    Returns (ok: bool, response) where response is a Flask response if not ok.
    """
    if not user:
        return False, (jsonify({"success": False, "message": "Not authenticated"}), 401)
    if roles and user.get("role") not in roles:
        return (
            False,
            (jsonify({"success": False, "message": "Forbidden for this role"}), 403),
        )
    return True, None

