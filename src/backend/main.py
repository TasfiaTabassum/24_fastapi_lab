from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
import logging

app = FastAPI()


# Configure CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Update with your frontend URL
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],  # Add OPTIONS method
    allow_headers=["Content-Type", "Authorization"],
)


# Configure logging
logging.basicConfig(filename='backend.log', level=logging.INFO)

# MongoDB setup
client = MongoClient("mongodb://127.0.0.1:27017/") 
db = client["user_database"]
collection = db["users"]

class User(BaseModel):
    username: str
    password: str
    confirmPassword: str
    email: str
    phoneNumber: str
    

@app.post("/register/")
async def register_user(user: User):
    try:
        # Basic backend validations
        if len(user.username) < 5:
            raise HTTPException(status_code=400, detail="Username must be at least 5 characters")
        if len(user.password) < 6:
            raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
        if user.password != user.confirmPassword:
            raise HTTPException(status_code=400, detail="Passwords do not match")
        if not user.email:
            raise HTTPException(status_code=400, detail="Email cannot be empty")
        if not user.phoneNumber or len(user.phoneNumber) != 11:
            raise HTTPException(status_code=400, detail="Phone number must be 11 digits")

        # Check if username and email are unique
        if collection.find_one({"$or": [{"username": user.username}, {"email": user.email}]}):
            raise HTTPException(status_code=400, detail="Username or email already exists")

        # Save user data to MongoDB
        user_dict = user.dict()  # Convert Pydantic model to dictionary
        del user_dict["confirmPassword"]  # Remove confirm_password field
        collection.insert_one(user_dict)

        # Log success message
        logging.info(f"User '{user.username}' registered successfully.")
        return {"message": "User registered successfully"}

    except Exception as e:
        # Log error message
        logging.error(f"Error occurred during registration: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

