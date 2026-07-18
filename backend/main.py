# Vercel serverless entry point for FastAPI
# This file is what @vercel/python invokes

import sys
import os

# Add backend directory to Python path so imports work
sys.path.insert(0, os.path.dirname(__file__))

from fastapi import FastAPI, Request, Form
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from contextlib import asynccontextmanager
from typing import Optional

load_dotenv()

from routes import error_explainer, docs_generator, code_simplifier, ui_to_code, explain_code, auth
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
app.include_router(explain_code.router, prefix="/api", tags=["Explain Code"])
app.include_router(auth.router)


@app.get("/api/health")
async def health():
    return {"status": "ok", "version": "1.0.0"}


@app.post("/api/quick-chat")
async def quick_chat(
    request: Request,
    message: str = Form(...),
    history: Optional[str] = Form(None)
):
    api_key = request.headers.get("X-API-Key") or None
    groq_api_key = request.headers.get("X-Groq-API-Key") or None
    openrouter_api_key = request.headers.get("X-OpenRouter-API-Key") or None
    cerebras_api_key = request.headers.get("X-Cerebras-API-Key") or None
    preferred_provider = request.headers.get("X-Preferred-Provider") or "auto"
    
    prompt = f"""You are a helpful, enterprise-grade AI software development teammate built into the SkillSync AI Developer Operating System.
Answer the user's technical questions accurately, concisely, and with premium developer insights. Use markdown formatting and code snippets where appropriate.

Chat History:
{history or "No previous messages."}

User: {message}
Assistant:"""

    try:
        from ai_providers import gemini_client
        raw, model_used = await gemini_client.generate(
            prompt,
            api_key=api_key,
            groq_api_key=groq_api_key,
            openrouter_api_key=openrouter_api_key,
            cerebras_api_key=cerebras_api_key,
            preferred_provider=preferred_provider,
        )
        return {"response": raw, "model": model_used}
    except Exception as e:
        return {"response": f"AI error occurred: {str(e)}", "model": "error"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)


