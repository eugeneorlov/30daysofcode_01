# 🔥 30 Days of Code

A 30-day vibe coding challenge. Personalized apps + classic builds, all in React with Python backends where needed.

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Python + FastAPI + uv (starting Day 6)
- **Monorepo:** Turborepo + pnpm workspaces
- **CI/CD:** GitHub Actions → Vercel
- **Quality:** ESLint, Prettier, Vitest, Ruff, Trivy, gitleaks

## Quick Start

```bash
# Clone and install
git clone git@github.com:<your-username>/30-days-of-code.git
cd 30-days-of-code
pnpm install

# Create a new project
./scripts/new-project.sh day01-french-flashcards

# Start developing
cd apps/day01-french-flashcards
pnpm dev
```

## Commands

| Command | What it does |
|---------|-------------|
| `pnpm dev` | Start dev server (run from app dir) |
| `pnpm build` | Build all apps |
| `pnpm lint` | Lint all apps |
| `pnpm test` | Test all apps |
| `pnpm format` | Format all code |
| `./scripts/new-project.sh <name>` | Scaffold new React app |

Turborepo only runs tasks for apps that changed — CI stays fast even at Day 30.

## Project Index

| Day | Project | Status |
|-----|---------|--------|
| 01-02 | French Flashcards 🇫🇷 | ✅ |
| 03 | Muay Thai Round Timer ⏱️ | ✅ |
| 04-05 | Bodybuilding Log 🏋️ | ✅ |
| 06-07 | URL Shortener 🔗 | ✅ |
| 08-09 | BJJ Technique Encyclopedia 🥋 | ✅ |
| 10-11 | Pastebin 📋 | ✅ |
| 12-13 | ADV Ride Planner 🗺️ | ✅ |
| 14 | Markdown Note-Taker 📝 | ✅ |
| 15-16 | Real-Time Chat 💬 | ✅ |
| 17-18 | Weekly Planner 📅 | ✅ |
| 19-20 | Metal Discovery Board 🎵 | ✅ |
| 21 | Auth Module 🔐 | ✅ |
| 22-23 | Travel Bucket List 🌍 | ✅ |
| 24-25 | French Immersion Dashboard 🧠 | ✅ |
| 26 | Generative Art 🎨 | ✅ |
| 27-28 | Personal Dashboard 🏠 | ✅ |
| 29 | Portfolio Site 🚀 | ✅ |
| 30 | Wildcard 🎯 | ✅ |
