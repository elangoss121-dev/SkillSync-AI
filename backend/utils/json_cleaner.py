import re
import json
import logging

logger = logging.getLogger(__name__)

def extract_json_from_text(text: str) -> str:
    """
    Extracts a JSON object or array from a string that might contain markdown blocks
    like ```json ... ``` or other surrounding text.
    """
    text = text.strip()
    
    # Try to find a markdown json block
    match = re.search(r"```(?:json)?\s*(.*?)\s*```", text, re.DOTALL)
    if match:
        text = match.group(1).strip()
    
    # Fallback to finding the first { and last } or first [ and last ]
    start_obj = text.find('{')
    end_obj = text.rfind('}')
    start_arr = text.find('[')
    end_arr = text.rfind(']')
    
    if start_obj != -1 and end_obj != -1 and (start_arr == -1 or start_obj < start_arr):
        return text[start_obj:end_obj + 1]
    elif start_arr != -1 and end_arr != -1:
        return text[start_arr:end_arr + 1]
    
    return text
