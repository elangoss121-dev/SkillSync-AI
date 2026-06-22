"""
database.py — SQLite user store for SkillSync AI
Handles: table init, create user, fetch user, verify password
"""

import sqlite3
import random
import os
import shutil
import bcrypt
from pathlib import Path

# ── paths ──────────────────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent.parent

if os.environ.get("VERCEL"):
    DB_PATH = Path("/tmp") / "users.db"
    # Copy checked-in database to /tmp to allow write access in serverless environment
    if not DB_PATH.exists():
        SEED_DB = BASE_DIR / "users.db"
        if SEED_DB.exists():
            try:
                shutil.copy2(SEED_DB, DB_PATH)
            except Exception:
                pass
else:
    DB_PATH  = BASE_DIR / "users.db"

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

# ── avatar colour palette (randomly assigned at signup) ───────────────────────
AVATAR_COLORS = [
    "#6366f1", "#a855f7", "#ec4899", "#22d3ee",
    "#10b981", "#f97316", "#eab308", "#3b82f6",
]


# ── connection helper ──────────────────────────────────────────────────────────
def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row          # rows behave like dicts
    return conn


# ── initialise schema ─────────────────────────────────────────────────────────
def init_db():
    """Create / migrate the users table. Called at app startup."""
    conn = get_connection()
    try:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id             INTEGER PRIMARY KEY AUTOINCREMENT,
                name           TEXT    NOT NULL,
                username       TEXT    NOT NULL UNIQUE,
                email          TEXT    NOT NULL UNIQUE,
                phone          TEXT,
                date_of_birth  TEXT,
                gender         TEXT,
                bio            TEXT,
                avatar_color   TEXT    DEFAULT '#6366f1',
                password_hash  TEXT    NOT NULL,
                last_login     TEXT,
                created_at     TEXT    DEFAULT (datetime('now'))
            )
        """)
        conn.commit()

        # ── non-destructive migration: add new columns to existing DB ──────────
        existing_cols = {
            row[1]
            for row in conn.execute("PRAGMA table_info(users)").fetchall()
        }
        migrations = {
            "username":      "TEXT NOT NULL DEFAULT ''",
            "phone":         "TEXT",
            "date_of_birth": "TEXT",
            "gender":        "TEXT",
            "bio":           "TEXT",
            "avatar_color":  "TEXT DEFAULT '#6366f1'",
            "last_login":    "TEXT",
        }
        for col, definition in migrations.items():
            if col not in existing_cols:
                conn.execute(f"ALTER TABLE users ADD COLUMN {col} {definition}")
        conn.commit()

    finally:
        conn.close()


# ── safe public fields (never return password_hash) ───────────────────────────
PUBLIC_FIELDS = "id, name, username, email, phone, date_of_birth, gender, bio, avatar_color, last_login, created_at"


# ── CRUD helpers ───────────────────────────────────────────────────────────────
def create_user(
    name:          str,
    email:         str,
    password:      str,
    username:      str  = "",
    phone:         str  = "",
    date_of_birth: str  = "",
    gender:        str  = "",
    bio:           str  = "",
) -> dict | None:
    """
    Insert a new user. Returns the created user (public fields) as a dict,
    or None if the email already exists.
    """
    hashed       = hash_password(password)
    avatar_color = random.choice(AVATAR_COLORS)
    # Auto-generate username from email if not provided
    if not username:
        username = email.split("@")[0].lower().replace(".", "_")

    username = username.lower().strip()
    # Filter username to keep only alphanumeric and underscores
    username = "".join(c for c in username if c.isalnum() or c == "_")
    if not username:
        username = "user"

    conn = get_connection()
    try:
        # Resolve username conflicts dynamically
        base_username = username
        while True:
            row = conn.execute("SELECT id FROM users WHERE username = ?", (username,)).fetchone()
            if not row:
                break
            # Append a random 3-digit number to make it unique
            username = f"{base_username}_{random.randint(100, 999)}"

        conn.execute(
            """INSERT INTO users
               (name, username, email, phone, date_of_birth, gender, bio,
                avatar_color, password_hash)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                name,
                username,
                email.lower().strip(),
                phone or None,
                date_of_birth or None,
                gender or None,
                bio or None,
                avatar_color,
                hashed,
            ),
        )
        conn.commit()
        row = conn.execute(
            f"SELECT {PUBLIC_FIELDS} FROM users WHERE email = ?",
            (email.lower().strip(),),
        ).fetchone()
        return dict(row) if row else None
    except sqlite3.IntegrityError:
        return None          # duplicate email
    finally:
        conn.close()


def get_user_by_email(email: str) -> dict | None:
    """Return the FULL user row (including password_hash) for auth checks."""
    conn = get_connection()
    try:
        row = conn.execute(
            "SELECT * FROM users WHERE email = ?",
            (email.lower().strip(),),
        ).fetchone()
        return dict(row) if row else None
    finally:
        conn.close()


def get_user_by_id(user_id: int) -> dict | None:
    """Return public user fields by ID."""
    conn = get_connection()
    try:
        row = conn.execute(
            f"SELECT {PUBLIC_FIELDS} FROM users WHERE id = ?",
            (user_id,),
        ).fetchone()
        return dict(row) if row else None
    finally:
        conn.close()


def update_last_login(user_id: int) -> None:
    """Stamp the last_login timestamp on successful sign-in."""
    conn = get_connection()
    try:
        conn.execute(
            "UPDATE users SET last_login = datetime('now') WHERE id = ?",
            (user_id,),
        )
        conn.commit()
    finally:
        conn.close()


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False
