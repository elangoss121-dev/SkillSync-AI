"""
routes/auth.py — Authentication endpoints for SkillSync AI
  POST /api/auth/register  → create account
  POST /api/auth/login     → sign in, receive JWT
  GET  /api/auth/me        → decode token → return user profile
"""

from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr, field_validator
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
import os

from utils.database import create_user, get_user_by_email, get_user_by_id, verify_password, update_last_login

router = APIRouter(prefix="/api/auth", tags=["Auth"])

# ── JWT config ─────────────────────────────────────────────────────────────────
SECRET_KEY  = os.getenv("JWT_SECRET", "skillsync-super-secret-key-change-in-prod")
ALGORITHM   = "HS256"
EXPIRE_DAYS = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


# ── helpers ────────────────────────────────────────────────────────────────────
def _make_token(user_id: int) -> str:
    expire  = datetime.now(timezone.utc) + timedelta(days=EXPIRE_DAYS)
    payload = {"sub": str(user_id), "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def _decode_token(token: str) -> int:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return int(payload["sub"])
    except (JWTError, KeyError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    user_id = _decode_token(token)
    user    = get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# ── schemas ────────────────────────────────────────────────────────────────────
class RegisterRequest(BaseModel):
    name:     str
    email:    EmailStr
    password: str

    @field_validator("name")
    @classmethod
    def name_not_empty(cls, v: str) -> str:
        if len(v.strip()) < 2:
            raise ValueError("Name must be at least 2 characters")
        return v.strip()

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters")
        return v


class LoginRequest(BaseModel):
    email:    EmailStr
    password: str


class AuthResponse(BaseModel):
    token:  str
    user:   dict


# ── endpoints ──────────────────────────────────────────────────────────────────
@router.post("/register", response_model=AuthResponse, status_code=201)
async def register(body: RegisterRequest):
    user = create_user(body.name, body.email, body.password)
    if user is None:
        raise HTTPException(
            status_code=409,
            detail="An account with this email already exists",
        )
    token = _make_token(user["id"])
    return {"token": token, "user": user}


@router.post("/login", response_model=AuthResponse)
async def login(body: LoginRequest):
    row = get_user_by_email(body.email)
    if not row or not verify_password(body.password, row["password_hash"]):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )
    user  = {k: v for k, v in row.items() if k != "password_hash"}
    token = _make_token(user["id"])
    update_last_login(user["id"])
    return {"token": token, "user": user}


@router.get("/me")
async def me(current_user: dict = Depends(get_current_user)):
    return current_user
