from google import genai
from google.genai import types
import os
from typing import Tuple, Optional

_client = None

# Model priority list — tries in order until one succeeds
MODELS = [
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-2.0-flash",
    "gemini-2.5-pro",
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b",
]


def get_client(api_key: str = None) -> genai.Client:
    """Return a Gemini Client. If api_key is provided use it; otherwise fall back to env var."""
    global _client
    if api_key:
        return genai.Client(api_key=api_key)
    if _client is None:
        env_key = os.getenv("GEMINI_API_KEY")
        if not env_key:
            raise ValueError("GEMINI_API_KEY not set in environment variables")
        _client = genai.Client(api_key=env_key)
    return _client


async def generate(
    prompt: str,
    image_data: bytes = None,
    api_key: Optional[str] = None,
    groq_api_key: Optional[str] = None,
    openrouter_api_key: Optional[str] = None,
    cerebras_api_key: Optional[str] = None,
    preferred_provider: Optional[str] = "auto",
) -> Tuple[str, str]:
    """Generate a response using a customizable chain of providers with automatic failover.
    
    Priority chain (auto mode): Groq → OpenRouter → Cerebras → Gemini
    Each provider is tried in sequence; on error, the next provider is attempted.
    Authentication failures (401) are raised immediately to prevent infinite retries.
    """

    async def try_groq():
        from ai_providers import groq_client
        effective_groq_key = groq_client.get_api_key(groq_api_key)
        if effective_groq_key and effective_groq_key != "your_groq_api_key_here":
            return await groq_client.generate(prompt, api_key=effective_groq_key)
        raise ValueError("Groq key not configured")

    async def try_openrouter():
        from ai_providers import openrouter_client
        effective_or_key = openrouter_client.get_api_key(openrouter_api_key)
        if effective_or_key and effective_or_key != "your_openrouter_api_key_here":
            return await openrouter_client.generate(prompt, api_key=effective_or_key)
        raise ValueError("OpenRouter key not configured")

    async def try_cerebras():
        from ai_providers import cerebras_client
        effective_cb_key = cerebras_client.get_api_key(cerebras_api_key)
        if effective_cb_key and effective_cb_key != "your_cerebras_api_key_here":
            return await cerebras_client.generate(prompt, api_key=effective_cb_key)
        raise ValueError("Cerebras key not configured")

    async def try_gemini():
        client = get_client(api_key)
        contents = [prompt]
        if image_data:
            import PIL.Image
            import io
            img = PIL.Image.open(io.BytesIO(image_data))
            contents = [img, prompt]

        last_error = None
        for model in MODELS:
            try:
                response = await client.aio.models.generate_content(
                    model=model,
                    contents=contents,
                )
                return response.text, model
            except Exception as e:
                err_str = str(e)
                if "API_KEY_INVALID" in err_str or "api key not valid" in err_str.lower() or "invalid api key" in err_str.lower():
                    raise
                last_error = e
                continue
        raise last_error or Exception("All Gemini models failed")

    # If image data is present, we must use Gemini (only provider with vision support)
    if image_data:
        return await try_gemini()

    # Determine execution priority chain based on preferred_provider
    provider = (preferred_provider or "auto").lower().strip()
    if provider == "groq":
        chain = [try_groq, try_openrouter, try_cerebras, try_gemini]
    elif provider == "openrouter":
        chain = [try_openrouter, try_groq, try_cerebras, try_gemini]
    elif provider == "cerebras":
        chain = [try_cerebras, try_groq, try_openrouter, try_gemini]
    elif provider == "gemini":
        chain = [try_gemini, try_groq, try_openrouter, try_cerebras]
    else:  # auto — fastest first, Gemini as final fallback
        chain = [try_groq, try_openrouter, try_cerebras, try_gemini]

    last_error = None
    for attempt_func in chain:
        try:
            return await attempt_func()
        except Exception as e:
            # Stop immediately on authentication errors — do not waste retries
            err_str = str(e)
            if "API_KEY_INVALID" in err_str or "Authentication Failed" in err_str:
                raise
            last_error = e
            continue

    raise last_error or Exception("All AI providers failed to generate content")


def is_available() -> bool:
    try:
        key = os.getenv("GEMINI_API_KEY", "")
        return bool(key and key != "your_gemini_api_key_here")
    except Exception:
        return False
