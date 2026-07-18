import httpx
import os
from typing import Optional, Tuple

# Valid Groq models — see https://console.groq.com/docs/models
GROQ_MODELS = [
    "llama-3.3-70b-versatile",
    "llama-3.1-70b-versatile",
    "llama-3.1-8b-instant",
    "gemma2-9b-it",
]


def get_api_key(api_key: Optional[str] = None) -> str:
    """Return the Groq API key, checking parameters first then env."""
    if api_key:
        return api_key
    return os.getenv("GROQ_API_KEY", "")


async def generate(prompt: str, api_key: Optional[str] = None) -> Tuple[str, str]:
    """
    Generate a response from Groq using automatic model fallback.
    Returns a tuple of (response_text, model_name_used).
    """
    key = get_api_key(api_key)
    if not key:
        raise ValueError("Groq API Key is not set")

    last_error = None
    async with httpx.AsyncClient() as client:
        for model in GROQ_MODELS:
            try:
                response = await client.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {key}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": model,
                        "messages": [{"role": "user", "content": prompt}],
                        "temperature": 0.3,
                        "max_tokens": 8192,
                    },
                    timeout=35.0,
                )

                if response.status_code == 200:
                    result = response.json()
                    content = result["choices"][0]["message"]["content"]
                    return content, f"groq/{model}"

                err_body = response.text
                if response.status_code == 401:
                    raise ValueError(f"Groq Authentication Failed (401): {err_body}")

                raise Exception(f"Groq API error ({response.status_code}) on model {model}: {err_body}")

            except Exception as e:
                if "Authentication Failed" in str(e):
                    raise
                last_error = e
                continue

    raise last_error or Exception("All Groq models failed")


def is_available() -> bool:
    """Check if a Groq API Key is configured."""
    key = os.getenv("GROQ_API_KEY", "")
    return bool(key and key != "your_groq_api_key_here")
