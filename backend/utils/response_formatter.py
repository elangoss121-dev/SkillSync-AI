import json
import re


def extract_json(raw: str) -> dict:
    """Extract JSON from a raw Gemini response (may contain markdown fences)."""
    # Try direct parse first
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        pass

    # Strip markdown code fences safely from the start and end
    cleaned = raw.strip()
    if cleaned.startswith("```"):
        # Find first newline to strip the language tag (like ```json)
        first_newline = cleaned.find("\n")
        if first_newline != -1:
            cleaned = cleaned[first_newline:].strip()
        else:
            cleaned = cleaned[3:].strip()
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3].strip()
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        pass

    # Try to find JSON object within the text
    match = re.search(r'\{[\s\S]*\}', raw)
    if match:
        try:
            return json.loads(match.group())
        except json.JSONDecodeError:
            pass

    raise ValueError(f"Could not extract valid JSON from response: {raw[:200]}")


def build_response(data: dict, confidence: float = 0.85, demo_mode: bool = False, model_name: str = "gemini-1.5-flash") -> dict:
    return {
        "success": True,
        "confidence": confidence,
        "data": data,
        "model": model_name + (" (demo)" if demo_mode else ""),
        "demo_mode": demo_mode,
    }

