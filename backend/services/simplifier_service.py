from ai_providers import gemini_client
from ai_providers.prompt_templates import CODE_SIMPLIFIER_SYSTEM
from utils.response_formatter import extract_json, build_response
from fastapi import HTTPException
from typing import Optional


async def simplify_code(
    code: str,
    language: str,
    beginner_mode: bool,
    api_key: Optional[str] = None,
    groq_api_key: Optional[str] = None,
    openrouter_api_key: Optional[str] = None,
    preferred_provider: Optional[str] = "auto",
) -> dict:
    if not code.strip():
        raise HTTPException(status_code=400, detail="Code cannot be empty")

    beginner_note = " Use very simple language, real-world analogies, and avoid jargon." if beginner_mode else ""

    prompt = f"""{CODE_SIMPLIFIER_SYSTEM}{beginner_note}

Language: {language}
Code to analyze:
```{language}
{code}
```

Respond with valid JSON only."""

    try:
        raw, model_used = await gemini_client.generate(
            prompt,
            api_key=api_key,
            groq_api_key=groq_api_key,
            openrouter_api_key=openrouter_api_key,
            preferred_provider=preferred_provider,
        )


        data = extract_json(raw)
        return build_response(data, confidence=0.87, model_name=model_used)

    except ValueError as e:
        raise HTTPException(status_code=500, detail=f"AI parsing error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
