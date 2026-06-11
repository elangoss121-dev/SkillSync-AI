import zipfile
import io


def parse_zip(zip_bytes: bytes, max_files: int = 20, max_size_kb: int = 50) -> str:
    """Extract text content from a ZIP file, returning concatenated source code."""
    TEXT_EXTENSIONS = {'.py', '.js', '.ts', '.jsx', '.tsx', '.java', '.go',
                       '.rs', '.cpp', '.c', '.h', '.md', '.txt', '.json', '.yaml', '.yml', '.env'}
    result = []
    try:
        with zipfile.ZipFile(io.BytesIO(zip_bytes)) as z:
            count = 0
            for name in z.namelist():
                if count >= max_files:
                    break
                ext = '.' + name.rsplit('.', 1)[-1].lower() if '.' in name else ''
                if ext not in TEXT_EXTENSIONS:
                    continue
                info = z.getinfo(name)
                if info.file_size > max_size_kb * 1024:
                    continue
                try:
                    content = z.read(name).decode('utf-8', errors='ignore')
                    result.append(f"=== {name} ===\n{content}\n")
                    count += 1
                except Exception:
                    pass
    except zipfile.BadZipFile:
        pass
    return '\n'.join(result)
