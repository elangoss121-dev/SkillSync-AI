from fastapi import APIRouter, Form, Request
from typing import Optional
from services.simplifier_service import simplify_code

router = APIRouter()


@router.post("/simplify-code")
async def simplify(
    request: Request,
    code: str = Form(...),
    language: Optional[str] = Form("python"),
    beginner_mode: Optional[bool] = Form(False),
):
    api_key = request.headers.get("X-API-Key") or None
    result = await simplify_code(code=code, language=language, beginner_mode=beginner_mode, api_key=api_key)
    return result
