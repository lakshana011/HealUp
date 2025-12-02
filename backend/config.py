"""Configuration settings for HealUp backend."""
import os

# MongoDB Configuration
MONGO_URI = "mongodb+srv://lakshanaa011_db_user:I8ZBSJb0ErxT8fOT@healup.mssa0ni.mongodb.net/?appName=HealUp"
DB_NAME = "healup_db"

# JWT Configuration
JWT_SECRET = os.environ.get("HEALUP_JWT_SECRET", "change-this-secret-in-production")
JWT_ALGO = "HS256"

# Flask Configuration
DEBUG = os.environ.get("FLASK_DEBUG", "True").lower() == "true"
HOST = os.environ.get("FLASK_HOST", "0.0.0.0")
PORT = int(os.environ.get("FLASK_PORT", "5000"))

