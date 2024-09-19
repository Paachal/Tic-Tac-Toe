# app/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import Dict

router = APIRouter()

# In-memory storage for demonstration
users_db: Dict[str, str] = {}

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class User(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

@router.post("/register")
async def register(user: User):
    if user.username in users_db:
        raise HTTPException(status_code=400, detail="Username already registered")
    users_db[user.username] = user.password
    return {"msg": "User registered successfully"}

@router.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user_password = users_db.get(form_data.username)
    if not user_password or user_password != form_data.password:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    return {"access_token": form_data.username, "token_type": "bearer"}

async def get_current_user(token: str = Depends(oauth2_scheme)):
    if token not in users_db:
        raise HTTPException(status_code=401, detail="Invalid token")
    return token
