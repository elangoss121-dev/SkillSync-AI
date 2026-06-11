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
    file_bytes = await file.read() if file else None
    result = await generate_documentation(
        github_url=github_url,
        source_code=source_code,
        file_bytes=file_bytes,
        filename=file.filename if file else None,
        api_key=api_key,
    )
    return result
