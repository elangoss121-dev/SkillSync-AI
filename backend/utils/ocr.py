import os
import pytesseract
from PIL import Image
import io

# Allow custom Tesseract path (Windows)
tesseract_cmd = os.getenv("TESSERACT_CMD")
if tesseract_cmd:
    pytesseract.pytesseract.tesseract_cmd = tesseract_cmd

TESSERACT_AVAILABLE = False
try:
    pytesseract.get_tesseract_version()
    TESSERACT_AVAILABLE = True
except Exception:
    pass


def extract_text_from_image(image_bytes: bytes) -> str:
    """Extract text from an image using OCR. Returns empty string if unavailable."""
    if not TESSERACT_AVAILABLE:
        return ""
    try:
        img = Image.open(io.BytesIO(image_bytes))
        text = pytesseract.image_to_string(img)
        return text.strip()
    except Exception as e:
        return ""
