from fastapi import APIRouter, UploadFile, File, Form, Request
from typing import Optional
from services.ui_code_service import convert_ui_to_code

router = APIRouter()


@router.post("/ui-to-code")
async def ui_to_code(
    request: Request,
    image: Optional[UploadFile] = File(None),
    description: Optional[str] = Form(None),
):
    api_key = request.headers.get("X-API-Key") or None
    groq_api_key = request.headers.get("X-Groq-API-Key") or None
    openrouter_api_key = request.headers.get("X-OpenRouter-API-Key") or None
    preferred_provider = request.headers.get("X-Preferred-Provider") or "auto"
    image_bytes = await image.read() if image else None
    result = await convert_ui_to_code(
        image_bytes=image_bytes,
        description=description,
        api_key=api_key,
        groq_api_key=groq_api_key,
        openrouter_api_key=openrouter_api_key,
        preferred_provider=preferred_provider,
    )
    return result



