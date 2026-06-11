import httpx
import os
from typing import Optional, Tuple

OPENROUTER_MODELS = [
    "meta-llama/llama-3.3-70b-instruct",
    "google/gemini-2.5-flash",
    "deepseek/deepseek-chat",
    "qwen/qwen-2.5-coder-32b-instruct",
]


def get_api_key(api_key: Optional[str] = None) -> str:
    """Return the OpenRouter API key, checking parameters first then env."""
    if api_key:
        return api_key
    return os.getenv("OPENROUTER_API_KEY", "")


async def generate(prompt: str, api_key: Optional[str] = None) -> Tuple[str, str]:
    """
    Generate a response from OpenRouter using automatic model fallback.
    Returns a tuple of (response_text, model_name_used).
    """
    key = get_api_key(api_key)
    if not key:
        raise ValueError("OpenRouter API Key is not set")

    last_error = None
    async with httpx.AsyncClient() as client:
        for model in OPENROUTER_MODELS:
            try:
                response = await client.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {key}",
                        "Content-Type": "application/json",
                        "HTTP-Referer": "http://localhost:3000",
                        "X-Title": "SkillSync AI",
                    },
                    json={
                        "model": model,
                        "messages": [{"role": "user", "content": prompt}],
                    },
                    timeout=35.0,
                )

                if response.status_code == 200:
                    result = response.json()
                    content = result["choices"][0]["message"]["content"]
                    return content, f"openrouter/{model}"

                err_body = response.text
                if response.status_code == 401:
                    # Authentication failure, stop immediately
                    raise ValueError(f"OpenRouter Authentication Failed (401): {err_body}")

                raise Exception(f"OpenRouter API error ({response.status_code}) on model {model}: {err_body}")

            except Exception as e:
                # If it's authentication error, re-raise immediately
                if "Authentication Failed" in str(e):
                    raise
                last_error = e
                # Fall back to next model on other errors
                continue

    raise last_error or Exception("All OpenRouter models failed")


def is_available() -> bool:
    """Check if an OpenRouter API Key is configured."""
    key = os.getenv("OPENROUTER_API_KEY", "")
    return bool(key and key != "your_openrouter_api_key_here")
