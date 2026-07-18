# SkillSync AI 🤖

Your AI teammate for debugging, documentation, code understanding, and optimization.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.x-blue)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-green)](https://fastapi.tiangolo.com)

## Overview

SkillSync AI is an enterprise-grade AI coding assistant built to boost developer productivity. It provides a suite of 5 powerful tools powered by advanced Large Language Models (LLMs).

### Core Features

- 🐛 **Debug Code**: Paste a stack trace or a buggy snippet, and AI will find the root cause, explain it in simple terms, and provide a fix.
- 🔄 **Convert Code**: Effortlessly translate code between programming languages (e.g., Python to TypeScript, Go to Rust) preserving business logic.
- 🧪 **Generate Unit Tests**: Auto-generate comprehensive test suites (Jest, PyTest, JUnit) including edge cases and coverage maps from source files or GitHub links.
- ⚡ **Optimize Code**: Reduce cognitive complexity and improve performance of your scripts with line-by-line breakdowns and suggested refactors.
- 📖 **Explain Code**: Break down complex, undecipherable code line-by-line with plain English explanations and real-world analogies.

## Architecture

- **Frontend**: React + Vite + Tailwind CSS + Framer Motion. Built with a stunning dark-mode IDE aesthetic.
- **Backend**: FastAPI (Python) handling routing and API coordination.
- **AI Engine**: Multi-provider support including Gemini (Google), Groq, OpenRouter, and Cerebras. Built-in automatic fallback ensures high availability.
- **Database**: SQLite (via SQLAlchemy) for user management and authentication.

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- An API Key from Google AI Studio (Gemini), Groq, OpenRouter, or Cerebras.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/skillsync-ai.git
cd skillsync-ai
```

### 2. Environment Setup

All configuration variables are located in a single `.env` file at the root of the project.

```bash
# In the project root directory:
cp .env.example .env
# Edit .env and configure all variables (Firebase, API keys, JWT_SECRET, etc.)
```

### 3. Backend Setup

```bash
cd backend
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn main:app --reload --port 8000
```

### 4. Frontend Setup

Open a new terminal window:

```bash
cd frontend
npm install

# Start the dev server
npm run dev
```

The app will be running at `http://localhost:5173`.

## Demo Mode

If you don't have an API key, you can still test the UI! The application includes a **Demo Mode** toggle in the user dropdown menu that uses rich mock data for all 5 tools, allowing you to experience the interface without making actual API calls.

## Deployment (Vercel)

The repository includes a `vercel.json` file configured for full-stack deployment on Vercel (both the Vite frontend and the FastAPI backend as serverless functions).

1. Push your code to GitHub.
2. Import the project into Vercel.
3. Add the environment variables from your `.env` files to the Vercel project settings.
4. Deploy!

## License

This project is licensed under the MIT License - see the LICENSE file for details.
