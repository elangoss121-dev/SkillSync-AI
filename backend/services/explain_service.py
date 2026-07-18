import json
import logging
from typing import Optional, Dict, Any

from utils.json_cleaner import extract_json_from_text
from ai_providers.prompt_templates import EXPLAIN_CODE_SYSTEM
from ai_providers.gemini_client import generate_with_fallback

logger = logging.getLogger(__name__)

async def explain_code(
    code: str,
    language: Optional[str] = "javascript",
    api_key: Optional[str] = None,
    groq_api_key: Optional[str] = None,
    openrouter_api_key: Optional[str] = None,
    cerebras_api_key: Optional[str] = None,
    preferred_provider: str = "auto",
) -> Dict[str, Any]:
    """
    Explain how a piece of code works line-by-line using AI.
    """
    if not code:
        raise ValueError("No code provided to explain.")

    prompt = f"""
Language: {language}

Please explain the following code:
```
{code}
```
"""

    response_text, model_used = await generate_with_fallback(
        prompt=prompt,
        system_instruction=EXPLAIN_CODE_SYSTEM,
        api_key=api_key,
        groq_api_key=groq_api_key,
        openrouter_api_key=openrouter_api_key,
        cerebras_api_key=cerebras_api_key,
        preferred_provider=preferred_provider,
    )

    clean_json = extract_json_from_text(response_text)
    
    try:
        data = json.loads(clean_json)
    except json.JSONDecodeError:
        logger.error(f"Failed to parse JSON from AI response: {clean_json}")
        # Fallback structure if parsing fails
        data = {
            "summary": "Failed to parse explanation format.",
            "complexity_label": "Unknown",
            "step_by_step": [],
            "key_concepts": [],
            "real_world_analogy": "N/A"
        }

    return {
        "status": "success",
        "data": data,
        "model": model_used
    }
