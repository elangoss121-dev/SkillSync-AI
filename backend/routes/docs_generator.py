from fastapi import APIRouter, UploadFile, File, Form, Request
from typing import Optional
from services.docs_service import generate_documentation

router = APIRouter()


@router.post("/generate-docs")
async def generate_docs(
    request: Request,
    github_url: Optional[str] = Form(None),
    source_code: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
):
    api_key = request.headers.get("X-API-Key") or None
    groq_api_key = request.headers.get("X-Groq-API-Key") or None
    openrouter_api_key = request.headers.get("X-OpenRouter-API-Key") or None
    preferred_provider = request.headers.get("X-Preferred-Provider") or "auto"
    file_bytes = await file.read() if file else None
    result = await generate_documentation(
        github_url=github_url,
        source_code=source_code,
        file_bytes=file_bytes,
        filename=file.filename if file else None,
        api_key=api_key,
        groq_api_key=groq_api_key,
        openrouter_api_key=openrouter_api_key,
        preferred_provider=preferred_provider,
    )
    return result



