from ai_providers import gemini_client
from ai_providers.prompt_templates import UI_TO_CODE_SYSTEM
from utils.response_formatter import extract_json, build_response
from fastapi import HTTPException
from typing import Optional


async def convert_ui_to_code(image_bytes: Optional[bytes], description: Optional[str], api_key: Optional[str] = None) -> dict:
    if not image_bytes and not description:
        raise HTTPException(status_code=400, detail="Provide an image or description")

    desc_part = f"\nAdditional description: {description}" if description else ""
    prompt = f"""{UI_TO_CODE_SYSTEM}{desc_part}

Analyze the UI design in the image and generate React + Tailwind code.
Respond with valid JSON only."""

    try:
        raw = await gemini_client.generate(prompt, image_bytes, api_key=api_key)
        data = extract_json(raw)
        return build_response(data, confidence=0.83)
    except ValueError as e:
        raise HTTPException(status_code=500, detail=f"AI parsing error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
