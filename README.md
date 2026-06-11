# SkillSync AI — AI-Powered Developer Productivity Copilot

> Your AI teammate for debugging, documentation & code understanding.

## Quick Start

### Frontend
```bash
cd frontend
npm install
npm run dev
# Opens at http://localhost:5173
```

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate       # Windows
pip install -r requirements.txt
copy .env.example .env      # Then add your GEMINI_API_KEY
python main.py
# Runs at http://localhost:8000
```

## Demo Mode
Toggle **Demo Mode** in the top navbar — works fully without any API key using rich mock responses.

## Environment Variables (backend/.env)
```env
GEMINI_API_KEY=your_key_here
CORS_ORIGINS=http://localhost:5173
```
