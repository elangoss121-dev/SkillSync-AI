# Vercel serverless entry point for FastAPI
# This file is what @vercel/python invokes

import sys
import os

# Add backend directory to Python path so imports work
sys.path.insert(0, os.path.dirname(__file__))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from contextlib import asynccontextmanager

load_dotenv()

from routes import error_explainer, docs_generator, code_simplifier, ui_to_code, auth
from utils.database import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(
    title="SkillSync AI API",
    description="AI-powered developer productivity copilot backend",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — allow all origins in production (restrict to your Vercel domain in prod)
origins_env = os.getenv("CORS_ORIGINS", "*")
origins = origins_env.split(",") if origins_env != "*" else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True if origins != ["*"] else False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(error_explainer.router, prefix="/api", tags=["Error Explainer"])
app.include_router(docs_generator.router, prefix="/api", tags=["Docs Generator"])
app.include_router(code_simplifier.router, prefix="/api", tags=["Code Simplifier"])
app.include_router(ui_to_code.router, prefix="/api", tags=["UI to Code"])
app.include_router(auth.router)


@app.get("/api/health")
async def health():
    return {"status": "ok", "version": "1.0.0"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

