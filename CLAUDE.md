# CLAUDE.md — 30 Days of Code

## Project Overview

This is a 30-day coding challenge monorepo. Each app is a standalone project inside `apps/`. The goal is to learn React by building personalized tools and classic apps with Python (FastAPI) backends where needed.

## Tech Stack

- **Frontend:** React 18+ with Vite, Tailwind CSS
- **Backend:** Python 3.12+ with FastAPI, managed by `uv`
- **Monorepo:** Turborepo + pnpm workspaces
- **Testing:** Vitest + React Testing Library (frontend), pytest (backend)
- **Linting:** ESLint + Prettier (frontend), Ruff (backend)
- **Deployment:** Vercel (frontends), backend TBD

## Repository Structure

```
30daysofcode_01/
├── .github/workflows/     # CI/CD pipelines
├── apps/
│   ├── day01-french-flashcards/   # Frontend-only apps
│   │   ├── src/
│   │   ├── package.json
│   │   └── vite.config.js
│   ├── day06-url-shortener/       # Full-stack apps
│   │   ├── frontend/
│   │   └── backend/
│   └── ...
├── packages/              # Shared code (future)
├── scripts/
│   └── new-project.sh     # Scaffold new apps
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

## Workflow & Branch Strategy

- **Never commit directly to `main`.** Always create a feature branch.
- Branch naming: `feat/day01-flashcards`, `fix/day01-card-flip-bug`
- One PR per feature or day's work.
- Squash merge only.
- After pushing a branch, create a PR with `gh pr create`.

## Commands

```bash
# Scaffold a new project
./scripts/new-project.sh day03-round-timer

# Development (run from inside an app directory)
pnpm dev              # Vite dev server
pnpm lint             # ESLint
pnpm format           # Prettier auto-fix
pnpm format:check     # Prettier check only
pnpm test             # Vitest run
pnpm test:watch       # Vitest watch mode
pnpm build            # Production build

# From root (Turborepo runs only what changed)
pnpm lint
pnpm test
pnpm build
```

## Code Conventions — Frontend (React)

- **Functional components only.** No class components.
- **Named exports** for components, default export only for the root App.
- File naming: `PascalCase.jsx` for components, `camelCase.js` for utilities.
- Keep components small. If a component exceeds ~100 lines, extract sub-components.
- Use Tailwind CSS for all styling. No CSS modules, no styled-components.
- State management: start with `useState`/`useReducer`. Only add a library if genuinely needed.
- Always include at least one meaningful test per component (not just "renders without crashing").

### Component structure

```jsx
// imports
import { useState } from "react";

// component
export function FlashCard({ front, back }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div onClick={() => setFlipped(!flipped)}>
      {flipped ? back : front}
    </div>
  );
}
```

## Code Conventions — Backend (Python/FastAPI)

- Use `uv` for dependency management (not pip directly).
- Lint and format with Ruff.
- Structure:

```
backend/
├── src/
│   ├── main.py        # FastAPI app entry
│   ├── routes/        # Route handlers
│   ├── models/        # Pydantic models
│   └── services/      # Business logic
├── tests/
├── pyproject.toml
└── .python-version
```

- Type hints on all function signatures.
- Pydantic models for request/response schemas.
- Keep route handlers thin — business logic goes in `services/`.

## CI/CD Pipeline

PRs trigger automatically:
- **Frontend:** ESLint → Prettier check → Vitest → vite build → Trivy scan
- **Backend:** Ruff check → Ruff format check → pytest → Bandit (warn only) → Trivy scan
- **All PRs:** gitleaks secret scanning

All checks must pass before merge (except Bandit which is warn-only).

## What NOT To Do

- Don't install packages globally inside the project. Use pnpm workspace dependencies.
- Don't store API keys or secrets in code. Use `.env` files (already in `.gitignore`).
- Don't modify CI workflow files without explaining why.
- Don't add `node_modules`, `dist`, `.turbo`, or `__pycache__` to git.
- Don't skip tests. Every app should have at least basic tests before PR.

## Project Plan Reference

| Days | Project | Type |
|------|---------|------|
| 01-02 | French Flashcards 🇫🇷 | Frontend only |
| 03 | Muay Thai Round Timer ⏱️ | Frontend only |
| 04-05 | Bodybuilding Log 🏋️ | Frontend only |
| 06-07 | URL Shortener 🔗 | Full-stack |
| 08-09 | BJJ Technique Encyclopedia 🥋 | Frontend + JSON API |
| 10-11 | Pastebin 📋 | Full-stack |
| 12-13 | ADV Ride Planner 🗺️ | Frontend + Map API |
| 14 | Markdown Note-Taker 📝 | Frontend only |
| 15-16 | Real-Time Chat 💬 | Full-stack + WebSocket |
| 17-18 | Weekly Planner 📅 | Frontend only |
| 19-20 | Metal Discovery Board 🎵 | Frontend + External API |
| 21 | Auth Module 🔐 | Full-stack |
| 22-23 | Travel Bucket List 🌍 | Frontend + Map |
| 24-25 | French Immersion Dashboard 🧠 | Full-stack |
| 26 | Generative Art 🎨 | Frontend only |
| 27-28 | Personal Dashboard 🏠 | Frontend, multi-source |
| 29 | Portfolio Site 🚀 | Frontend only |
| 30 | Wildcard 🎯 | TBD |
