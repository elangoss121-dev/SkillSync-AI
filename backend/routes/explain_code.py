from fastapi import APIRouter, Form, Request
from typing import Optional
from services.explain_service import explain_code

router = APIRouter()


@router.post("/explain-code")
async def explain(
    request: Request,
    code: str = Form(...),
    language: Optional[str] = Form("javascript"),
):
    api_key = request.headers.get("X-API-Key") or None
    groq_api_key = request.headers.get("X-Groq-API-Key") or None
    openrouter_api_key = request.headers.get("X-OpenRouter-API-Key") or None
    cerebras_api_key = request.headers.get("X-Cerebras-API-Key") or None
    preferred_provider = request.headers.get("X-Preferred-Provider") or "auto"
    
    result = await explain_code(
        code=code,
        language=language,
        api_key=api_key,
        groq_api_key=groq_api_key,
        openrouter_api_key=openrouter_api_key,
        cerebras_api_key=cerebras_api_key,
        preferred_provider=preferred_provider,
    )
    return result
