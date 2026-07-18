// ─── MOCK DATA FOR DEMO MODE ─────────────────────────────────────
// Realistic, hackathon-grade mock AI responses

export const MOCK_ERROR_RESPONSE = {
  success: true,
  confidence: 0.94,
  demo_mode: true,
  model: 'gemini-1.5-flash (demo)',
  data: {
    error_type: 'TypeError',
    severity: 'high',
    probable_cause: 'Attempting to call `.map()` on an undefined value. This typically happens when an API response is not yet loaded, or the data shape is different from what the component expects.',
    beginner_explanation:
      "Imagine you asked a friend to count items in a box, but the box doesn't exist yet. JavaScript panics the same way — `.map()` needs an array to loop over, but got `undefined` instead.",
    fix_suggestions: [
      'Add a null check: `data?.items?.map(...)` or `(data?.items || []).map(...)`',
      'Check your API response shape matches what your component expects',
      'Add a loading state so the component waits before rendering',
      'Initialize your state with an empty array: `useState([])`',
    ],
    corrected_code: `// ❌ Before — causes TypeError
const items = data.items.map(item => item.name)

// ✅ After — safe with optional chaining
const items = (data?.items ?? []).map(item => item.name)

// ✅ Alternative — with loading guard
if (!data || !data.items) return <LoadingSpinner />
const items = data.items.map(item => item.name)`,
    deep_explanation:
      'JavaScript evaluates `data.items` before calling `.map()`. If `data` is `undefined` or `null`, accessing `.items` throws a `TypeError: Cannot read properties of undefined`. This is extremely common in React when state is initialized as `null` and the component renders before data arrives from an async source.',
    stack_trace_analysis:
      'The error likely originates from the component lifecycle — `useEffect` fires asynchronously, but the initial render runs synchronously with the uninitialized state.',
  },
}

export const MOCK_DOCS_RESPONSE = {
  success: true,
  confidence: 0.91,
  demo_mode: true,
  model: 'gemini-1.5-flash (demo)',
  data: {
    readme: `# DevMate AI 🤖

> Your AI teammate for debugging, documentation & code understanding.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.x-blue)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-green)](https://fastapi.tiangolo.com)

## Overview

DevMate AI is an AI-powered developer productivity copilot that helps you:
- 🐛 **Understand errors** with beginner-friendly explanations
- 📄 **Generate documentation** from source code
- 🧠 **Simplify complex code** with line-by-line breakdowns
- 🎨 **Convert UI designs** into production-ready React code

## Quick Start

\`\`\`bash
# Clone the repository
git clone https://github.com/your-org/devmate-ai.git
cd devmate-ai

# Install frontend
cd frontend && npm install && npm run dev

# Install backend
cd ../backend && pip install -r requirements.txt
uvicorn main:app --reload
\`\`\`

## Environment Variables

Copy \`.env.example\` to \`.env\` and fill in your keys:

\`\`\`env
GEMINI_API_KEY=your_gemini_api_key_here
CORS_ORIGINS=http://localhost:5173
\`\`\`
`,
    api_docs: `# API Documentation

## Base URL
\`http://localhost:8000/api\`

## Endpoints

### POST /explain-error
Analyze an error from a screenshot, log, or code snippet.

**Request:**
\`\`\`json
{
  "text": "TypeError: Cannot read properties of undefined (reading 'map')",
  "code_context": "const items = data.items.map(i => i.name)",
  "language": "javascript"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "confidence": 0.94,
  "data": {
    "error_type": "TypeError",
    "severity": "high",
    "probable_cause": "...",
    "fix_suggestions": ["..."],
    "corrected_code": "..."
  }
}
\`\`\`

### POST /generate-docs
Generate documentation from source code or GitHub URL.

### POST /simplify-code
Get line-by-line explanation and simplification of complex code.

### POST /ui-to-code
Convert a UI screenshot into React + Tailwind code.
`,
    setup_guide: `# Setup Guide

## Prerequisites

- Node.js 18+
- Python 3.11+
- Gemini API key ([Get one here](https://aistudio.google.com))

## Environment Setup

Copy \`.env.example\` in the project root to \`.env\` and fill in the required API keys (e.g. \`GEMINI_API_KEY\`, Firebase Config, etc.):

\`\`\`bash
cp .env.example .env
\`\`\`

## Frontend Setup

\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

## Backend Setup

\`\`\`bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
\`\`\`

## Tesseract OCR (Optional)

For screenshot analysis, install Tesseract:
- **Windows**: \`choco install tesseract\`
- **macOS**: \`brew install tesseract\`
- **Linux**: \`apt-get install tesseract-ocr\`
`,
    architecture: `# Architecture Overview

\`\`\`
devmate-ai/
├── frontend/                  # React + Vite + Tailwind
│   └── src/
│       ├── pages/             # Route-level page components
│       │   ├── LandingPage.jsx
│       │   └── dashboard/    # Feature pages
│       ├── components/        # Reusable UI components
│       │   ├── layout/       # Sidebar, Navbar
│       │   └── ui/           # Cards, modals, editors
│       ├── context/           # Global state (AppContext)
│       ├── hooks/             # useAI, useClipboard
│       ├── data/              # mockData.js
│       └── lib/               # api.js axios wrapper
│
└── backend/                   # FastAPI
    ├── routes/                # API route handlers
    ├── services/              # Business logic
    ├── ai_providers/          # Gemini client + prompts
    └── utils/                 # OCR, file parsing
\`\`\`
`,
  },
}

export const MOCK_SIMPLIFIER_RESPONSE = {
  success: true,
  confidence: 0.88,
  demo_mode: true,
  model: 'gemini-1.5-flash (demo)',
  data: {
    language: 'python',
    complexity_score: 7.2,
    complexity_label: 'Complex',
    line_explanations: [
      { line: 1, code: 'def memoize(fn):', explanation: 'Define a function `memoize` that takes another function as input — this is called a "higher-order function".' },
      { line: 2, code: '    cache = {}', explanation: 'Create an empty dictionary to store previous results — this is our memory (cache).' },
      { line: 3, code: '    def wrapper(*args):', explanation: 'Define an inner "wrapper" function that accepts any number of arguments.' },
      { line: 4, code: '        if args not in cache:', explanation: 'Check if we\'ve computed this result before by looking up the arguments in our cache.' },
      { line: 5, code: '            cache[args] = fn(*args)', explanation: 'If not cached, call the original function and store the result.' },
      { line: 6, code: '        return cache[args]', explanation: 'Return the cached result (whether freshly computed or retrieved).' },
      { line: 7, code: '    return wrapper', explanation: 'Return the wrapper function — this replaces the original function with our memoized version.' },
    ],
    simplified_version: `# Simplified version with comments
def memoize(fn):
    """
    Wraps any function to remember its results.
    Next time it's called with the same arguments,
    returns the saved result instead of recalculating.
    """
    saved_results = {}  # Our memory storage
    
    def remember_and_call(*args):
        if args not in saved_results:
            # Calculate and save for the first time
            saved_results[args] = fn(*args)
        # Return the saved result
        return saved_results[args]
    
    return remember_and_call`,
    optimizations: [
      'Consider using `functools.lru_cache` from Python standard library — it does the same thing but is more efficient',
      'Add cache size limit to prevent unbounded memory growth',
      'Handle mutable arguments (lists, dicts) which cannot be dictionary keys',
    ],
    algorithm_explanation:
      'This implements the Memoization pattern — a form of caching that stores function results keyed by their inputs. It trades memory for speed, making repeated calls with the same arguments O(1) instead of O(n).',
  },
}

export const MOCK_UI_TO_CODE_RESPONSE = {
  success: true,
  confidence: 0.85,
  demo_mode: true,
  model: 'gemini-1.5-flash (demo)',
  data: {
    description: 'A modern pricing card component with tier selection, feature list, and CTA button.',
    component_breakdown: [
      { name: 'PricingCard', description: 'Main container with glassmorphism styling' },
      { name: 'TierBadge', description: 'Highlighted "Most Popular" badge with gradient' },
      { name: 'PriceDisplay', description: 'Large price with currency and billing period' },
      { name: 'FeatureList', description: 'Checkmarked list of included features' },
      { name: 'CTAButton', description: 'Gradient call-to-action button' },
    ],
    react_code: `import { Check, Zap } from 'lucide-react'

export default function PricingCard({ 
  tier = 'Pro',
  price = 29,
  popular = true,
  features = []
}) {
  return (
    <div className={
      \`relative rounded-2xl p-6 border transition-all duration-300 \${
        popular 
          ? 'bg-gradient-to-b from-indigo-950/50 to-purple-950/30 border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.2)]' 
          : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-600'
      }\`
    }>
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Most Popular
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-1">{tier}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-white">\${price}</span>
          <span className="text-zinc-400 text-sm">/month</span>
        </div>
      </div>

      <ul className="space-y-3 mb-6">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-3 text-sm text-zinc-300">
            <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>

      <button className={
        \`w-full py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 \${
          popular
            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:-translate-y-0.5'
            : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
        }\`
      }>
        Get Started
      </button>
    </div>
  )
}`,
    tailwind_classes_used: [
      'rounded-2xl', 'border', 'bg-gradient-to-b', 'shadow-[...]',
      'absolute', '-top-3', 'flex', 'items-baseline',
      'space-y-3', 'transition-all', 'hover:-translate-y-0.5',
    ],
  },
}

export const MOCK_SAMPLE_ERROR_TEXT = `TypeError: Cannot read properties of undefined (reading 'map')
    at ProductList (ProductList.jsx:12:24)
    at renderWithHooks (react-dom.development.js:14985:18)
    at updateFunctionComponent (react-dom.development.js:17356:20)

The component tried to call .map() on data.products before the API response arrived.`

export const MOCK_SAMPLE_CODE = `def memoize(fn):
    cache = {}
    def wrapper(*args):
        if args not in cache:
            cache[args] = fn(*args)
        return cache[args]
    return wrapper

@memoize
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)`

export const MOCK_SAMPLE_GITHUB_URL = 'https://github.com/facebook/react'

export const MOCK_QUICK_CHAT_RESPONSE = {
  response: "I'm a mock AI assistant. Since you're in Demo Mode, I am responding with a canned message. Connect a real API key in `.env` to use the live cognitive engine."
}

export const MOCK_EXPLAIN_CODE_RESPONSE = {
  success: true,
  confidence: 0.92,
  demo_mode: true,
  model: 'gemini-1.5-flash (demo)',
  data: {
    summary: "This code implements a memoization decorator to cache function results and improve performance.",
    complexity_label: "Intermediate",
    step_by_step: [
      { step: 1, description: "A higher-order function `memoize` is defined.", code_snippet: "def memoize(fn):" },
      { step: 2, description: "A cache dictionary is initialized to store results.", code_snippet: "cache = {}" },
      { step: 3, description: "If the arguments are not in the cache, the function is executed and saved.", code_snippet: "if args not in cache:\n    cache[args] = fn(*args)" },
      { step: 4, description: "The cached result is returned.", code_snippet: "return cache[args]" }
    ],
    key_concepts: ["Decorators", "Memoization", "Closures", "Higher-Order Functions"],
    real_world_analogy: "It's like a math student remembering the answer to a hard calculation so they don't have to compute it from scratch the next time the teacher asks the exact same question."
  }
}
