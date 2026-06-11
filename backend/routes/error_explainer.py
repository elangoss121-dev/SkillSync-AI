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
    image_bytes = await image.read() if image else None
    result = await analyze_error(
        text=text,
        code_context=code_context,
        language=language,
        image_bytes=image_bytes,
        api_key=api_key,
    )
    return result
