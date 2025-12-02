"""Main Flask application."""
from flask import Flask
from flask_cors import CORS
from config import DEBUG, HOST, PORT

# Import routes
from routes import auth, doctors, patients, appointments, payments, prescriptions

app = Flask(__name__)
CORS(app)

# Register blueprints
app.register_blueprint(auth.auth_bp, url_prefix="/api/auth")
app.register_blueprint(doctors.doctors_bp, url_prefix="/api/doctors")
app.register_blueprint(patients.patients_bp, url_prefix="/api/patients")
app.register_blueprint(appointments.appointments_bp, url_prefix="/api/appointments")
app.register_blueprint(payments.payments_bp, url_prefix="/api/payments")
app.register_blueprint(prescriptions.prescriptions_bp, url_prefix="/api/prescriptions")

# Health check endpoint
@app.route("/api/health")
def health():
    return {"status": "ok"}


if __name__ == "__main__":
    app.run(host=HOST, port=PORT, debug=DEBUG)
