from google import genai
from google.genai import types
import os

_client = None

# Model priority list — tries in order until one succeeds
MODELS = [
    "gemini-1.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash-8b",
    "gemini-1.5-pro",
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


async def generate(prompt: str, image_data: bytes = None, api_key: str = None) -> str:
    """Generate a response from Gemini with automatic model fallback."""
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
            return response.text
        except Exception as e:
            err_str = str(e)
            # Only retry on quota/resource errors
            if "429" in err_str or "RESOURCE_EXHAUSTED" in err_str or "quota" in err_str.lower():
                last_error = e
                continue
            # For other errors, raise immediately
            raise

    raise last_error or Exception("All Gemini models failed")


def is_available() -> bool:
    try:
        key = os.getenv("GEMINI_API_KEY", "")
        return bool(key and key != "your_gemini_api_key_here")
    except Exception:
        return False
