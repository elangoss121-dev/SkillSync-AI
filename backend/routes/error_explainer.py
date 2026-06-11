from fastapi import APIRouter, UploadFile, File, Form, Request, HTTPException
from typing import Optional
from services.error_service import analyze_error

router = APIRouter()


@router.post("/explain-error")
async def explain_error(
    request: Request,
    text: Optional[str] = Form(None),
    code_context: Optional[str] = Form(None),
    language: Optional[str] = Form("javascript"),
    image: Optional[UploadFile] = File(None),
):
    api_key = request.headers.get("X-API-Key") or None
    groq_api_key = request.headers.get("X-Groq-API-Key") or None
    openrouter_api_key = request.headers.get("X-OpenRouter-API-Key") or None
    cerebras_api_key = request.headers.get("X-Cerebras-API-Key") or None
    preferred_provider = request.headers.get("X-Preferred-Provider") or "auto"
    image_bytes = await image.read() if image else None
    result = await analyze_error(
        text=text,
        code_context=code_context,
        language=language,
        image_bytes=image_bytes,
        api_key=api_key,
        groq_api_key=groq_api_key,
        openrouter_api_key=openrouter_api_key,
        cerebras_api_key=cerebras_api_key,
        preferred_provider=preferred_provider,
    )
    return result



