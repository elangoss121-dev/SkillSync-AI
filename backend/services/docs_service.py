from ai_providers import gemini_client
from ai_providers.prompt_templates import DOCS_GENERATOR_SYSTEM
from utils.file_parser import parse_zip
from utils.response_formatter import extract_json, build_response
from fastapi import HTTPException
from typing import Optional
import re
import httpx


def parse_github_url(url: str):
    """Parse owner and repo name from a github.com URL."""
    match = re.search(r"github\.com/([^/]+)/([^/]+)", url)
    if match:
        owner = match.group(1)
        repo = match.group(2)
        if repo.endswith(".git"):
            repo = repo[:-4]
        return owner, repo
    return None


async def download_github_repo(owner: str, repo: str) -> Optional[bytes]:
    """Download the ZIP archive of a public repository from GitHub."""
    url = f"https://api.github.com/repos/{owner}/{repo}/zipball"
    headers = {"User-Agent": "SkillSync-AI/1.0"}
    async with httpx.AsyncClient(follow_redirects=True) as client:
        try:
            response = await client.get(url, headers=headers, timeout=30.0)
            if response.status_code == 200:
                return response.content
        except Exception:
            pass
    return None


async def generate_documentation(
    github_url: Optional[str],
    source_code: Optional[str],
    file_bytes: Optional[bytes],
    filename: Optional[str],
    api_key: Optional[str] = None,
    groq_api_key: Optional[str] = None,
    openrouter_api_key: Optional[str] = None,
    preferred_provider: Optional[str] = "auto",
) -> dict:
    # Parse ZIP if uploaded
    file_content = ""
    if file_bytes and filename and filename.endswith('.zip'):
        file_content = parse_zip(file_bytes)
    elif file_bytes:
        file_content = file_bytes.decode('utf-8', errors='ignore')

    # Fetch and parse GitHub repository if URL provided
    github_content = ""
    if github_url:
        parsed = parse_github_url(github_url)
        if parsed:
            owner, repo = parsed
            repo_zip = await download_github_repo(owner, repo)
            if repo_zip:
                github_content = parse_zip(repo_zip)

    context = "\n\n".join(filter(None, [
        f"GitHub URL: {github_url}" if github_url else "",
        github_content,
        file_content,
        source_code,
    ]))

    if not context.strip():
        raise HTTPException(status_code=400, detail="Provide a GitHub URL, file, or source code")

    prompt = f"""{DOCS_GENERATOR_SYSTEM}

Project context:
---
{context[:8000]}
---

Generate complete documentation. Respond with valid JSON only."""

    try:
        raw, model_used = await gemini_client.generate(
            prompt,
            api_key=api_key,
            groq_api_key=groq_api_key,
            openrouter_api_key=openrouter_api_key,
            preferred_provider=preferred_provider,
        )


        data = extract_json(raw)
        return build_response(data, confidence=0.88, model_name=model_used)

    except ValueError as e:
        raise HTTPException(status_code=500, detail=f"AI parsing error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
