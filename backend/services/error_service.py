from ai_providers import gemini_client
from ai_providers.prompt_templates import ERROR_EXPLAINER_SYSTEM
from utils.ocr import extract_text_from_image
from utils.response_formatter import extract_json, build_response
from fastapi import HTTPException
from typing import Optional


async def analyze_error(
    text: Optional[str],
    code_context: Optional[str],
    language: Optional[str],
    image_bytes: Optional[bytes],
    api_key: Optional[str] = None,
    groq_api_key: Optional[str] = None,
    openrouter_api_key: Optional[str] = None,
    preferred_provider: Optional[str] = "auto",
) -> dict:
    # OCR extraction from image
    ocr_text = ""
    if image_bytes:
        ocr_text = extract_text_from_image(image_bytes)

    combined = "\n\n".join(filter(None, [text, ocr_text, code_context]))
    if not combined.strip():
        raise HTTPException(status_code=400, detail="Please provide error text or an image")

    prompt = f"""{ERROR_EXPLAINER_SYSTEM}

Error/Log to analyze:
Language: {language}
---
{combined}
---

Respond with valid JSON only."""

    try:
        raw, model_used = await gemini_client.generate(
            prompt,
            image_bytes if image_bytes else None,
            api_key=api_key,
            groq_api_key=groq_api_key,
            openrouter_api_key=openrouter_api_key,
            preferred_provider=preferred_provider,
        )


        data = extract_json(raw)
        return build_response(data, confidence=0.90, model_name=model_used)

    except ValueError as e:
        raise HTTPException(status_code=500, detail=f"AI parsing error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
