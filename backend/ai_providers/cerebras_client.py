import httpx
import os
from typing import Optional, Tuple

# Valid Cerebras models — see https://cloud.cerebras.ai
CEREBRAS_MODELS = [
    "llama-3.3-70b",
    "llama-3.1-70b",
    "llama-3.1-8b",
]


def get_api_key(api_key: Optional[str] = None) -> str:
    """Return the Cerebras API key, checking parameters first then env."""
    if api_key:
        return api_key
    return os.getenv("CEREBRAS_API_KEY", "")


async def generate(prompt: str, api_key: Optional[str] = None) -> Tuple[str, str]:
    """
    Generate a response from Cerebras using automatic model fallback.
    Returns a tuple of (response_text, model_name_used).
    """
    key = get_api_key(api_key)
    if not key:
        raise ValueError("Cerebras API Key is not set")

    last_error = None
    async with httpx.AsyncClient() as client:
        for model in CEREBRAS_MODELS:
            try:
                response = await client.post(
                    "https://api.cerebras.ai/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {key}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": model,
                        "messages": [{"role": "user", "content": prompt}],
                        "temperature": 0.3,
                        "max_completion_tokens": 8192,
                    },
                    timeout=40.0,
                )

                if response.status_code == 200:
                    result = response.json()
                    content = result["choices"][0]["message"]["content"]
                    return content, f"cerebras/{model}"

                err_body = response.text
                if response.status_code == 401:
                    raise ValueError(f"Cerebras Authentication Failed (401): {err_body}")

                if response.status_code == 429:
                    raise Exception(f"Cerebras rate limit on model {model}: {err_body}")

                raise Exception(f"Cerebras API error ({response.status_code}) on model {model}: {err_body}")

            except Exception as e:
                if "Authentication Failed" in str(e):
                    raise
                last_error = e
                continue

    raise last_error or Exception("All Cerebras models failed")


def is_available() -> bool:
    """Check if a Cerebras API Key is configured."""
    key = os.getenv("CEREBRAS_API_KEY", "")
    return bool(key and key != "your_cerebras_api_key_here")
