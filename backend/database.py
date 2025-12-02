"""Database connection and collection setup."""
from pymongo import MongoClient
from config import MONGO_URI, DB_NAME

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client[DB_NAME]

# Collections
users_col = db["users"]
doctors_col = db["doctors"]
patients_col = db["patients"]
appointments_col = db["appointments"]
availability_col = db["availability"]
payments_col = db["payments"]
prescriptions_col = db["prescriptions"]
reports_col = db["reports"]

