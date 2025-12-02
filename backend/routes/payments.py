"""Payment routes."""
from flask import Blueprint, request, jsonify
from datetime import datetime
from bson import ObjectId
from database import payments_col, appointments_col
from utils import require_auth, serialize

payments_bp = Blueprint("payments", __name__)


@payments_bp.post("/create-order")
def create_payment_order():
    """Create a payment order/session (Razorpay/Stripe integration later)."""
    user = require_auth()
    if not user:
        return jsonify({"success": False, "message": "Not authenticated"}), 401

    data = request.json or {}
    appointment_id = data.get("appointmentId")
    amount = data.get("amount")

    if not appointment_id or not amount:
        return jsonify({"success": False, "message": "Missing appointmentId or amount"}), 400

    # Verify appointment exists and belongs to user
    apt = appointments_col.find_one({"_id": ObjectId(appointment_id)})
    if not apt:
        return jsonify({"success": False, "message": "Appointment not found"}), 404

    if user["role"] == "patient" and apt.get("patientId") != str(user["_id"]):
        return jsonify({"success": False, "message": "Forbidden"}), 403

    # Create payment record
    payment = {
        "appointmentId": str(ObjectId(appointment_id)),
        "userId": str(user["_id"]),
        "amount": amount,
        "status": "pending",
        "created_at": datetime.utcnow(),
    }
    res = payments_col.insert_one(payment)
    payment["_id"] = res.inserted_id

    # TODO: Integrate with Razorpay/Stripe to create actual payment session
    # For now, return mock order ID
    return jsonify({
        "success": True,
        "orderId": str(payment["_id"]),
        "amount": amount,
        "message": "Payment order created (mock)",
    })


@payments_bp.post("/confirm")
def confirm_payment():
    """Mark payment as successful/failed."""
    user = require_auth()
    if not user:
        return jsonify({"success": False, "message": "Not authenticated"}), 401

    data = request.json or {}
    order_id = data.get("orderId")
    status = data.get("status")  # "success" or "failed"

    if not order_id or status not in ["success", "failed"]:
        return jsonify({"success": False, "message": "Invalid orderId or status"}), 400

    payment = payments_col.find_one({"_id": ObjectId(order_id)})
    if not payment:
        return jsonify({"success": False, "message": "Payment not found"}), 404

    # Update payment status
    payments_col.update_one(
        {"_id": ObjectId(order_id)},
        {"$set": {"status": status, "updated_at": datetime.utcnow()}},
    )

    # If payment successful, update appointment status
    if status == "success":
        appointments_col.update_one(
            {"_id": ObjectId(payment["appointmentId"])},
            {"$set": {"status": "confirmed", "paymentId": str(order_id)}},
        )

    return jsonify({"success": True, "message": f"Payment marked as {status}"})

