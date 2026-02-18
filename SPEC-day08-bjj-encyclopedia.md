# Day 08-09 — BJJ Technique Encyclopedia 🥋

## Overview

A reference web app for browsing, searching, and navigating BJJ techniques.
Techniques are connected in a full relationship graph (attacks → defenses → escapes → counters),
making it a navigable knowledge base rather than a flat list.

Two-day build: Day 08 = backend + data, Day 09 = frontend + graph view.

## Stack

Consistent with Day 06 (URL Shortener):

- **Frontend:** React 18 + Vite + Tailwind CSS, React Router v7
- **Backend:** FastAPI + SQLite via SQLModel, managed by `uv`
- **Testing:** Vitest + React Testing Library (frontend), pytest (backend)
- **Linting:** ESLint + Prettier (frontend), Ruff (backend)

## Directory Structure

```
apps/day08-bjj-encyclopedia/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TechniqueCard.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   ├── RelationshipGraph.jsx   # Linked cards, no D3
│   │   │   └── SearchInput.jsx
│   │   ├── pages/
│   │   │   ├── BrowsePage.jsx          # "/" — card grid + filters
│   │   │   └── TechniqueDetailPage.jsx # "/technique/:id"
│   │   ├── hooks/
│   │   │   └── useTechniques.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── backend/
    ├── src/
    │   ├── main.py
    │   ├── database.py       # SQLite engine + session
    │   ├── models/
    │   │   └── technique.py  # SQLModel table definitions
    │   ├── routes/
    │   │   └── techniques.py
    │   └── services/
    │       └── technique_service.py
    ├── scripts/
    │   └── seed.py           # Seed the 20 techniques + relationships
    ├── tests/
    │   └── test_techniques.py
    ├── pyproject.toml
    └── .python-version
```

---

## Data Model

### Technique (SQLModel table)

| Field | Type | Notes |
|-------|------|-------|
| `id` | int | PK, auto-increment |
| `name` | str | e.g. "Armbar from Guard" |
| `position` | str | enum: Guard, Mount, Back, Side Control, Half Guard, Turtle, Standing, Open Guard |
| `type` | str | enum: Submission, Sweep, Escape, Transition, Control |
| `difficulty` | str | enum: Beginner, Intermediate, Advanced |
| `description` | str | 2-4 sentence overview |
| `steps` | JSON | list of strings — numbered instructions |
| `common_mistakes` | JSON | list of strings |
| `counters` | JSON | list of strings (free text, not FK) |

### TechniqueRelationship (SQLModel table)

| Field | Type | Notes |
|-------|------|-------|
| `id` | int | PK |
| `from_technique_id` | int | FK → Technique |
| `to_technique_id` | int | FK → Technique |
| `relationship_type` | str | enum: leads_to, defends_against, escapes_from, counters |

---

## API Endpoints

```
GET  /techniques
     ?position=Guard
     ?type=Submission
     ?difficulty=Beginner
     ?q=armbar              # name/description search
     Returns: list of TechniqueCard schema (no steps/mistakes for perf)

GET  /techniques/{id}
     Returns: full Technique + outgoing/incoming relationships with neighbor details

GET  /health
     Returns: {"status": "ok"}
```

### Response Schemas (Pydantic)

```python
class TechniqueCard(BaseModel):
    id: int
    name: str
    position: str
    type: str
    difficulty: str
    description: str

class RelationshipOut(BaseModel):
    relationship_type: str
    technique: TechniqueCard  # the neighbor

class TechniqueDetail(TechniqueCard):
    steps: list[str]
    common_mistakes: list[str]
    counters: list[str]
    outgoing: list[RelationshipOut]   # "from here you can go to..."
    incoming: list[RelationshipOut]   # "this technique is referenced by..."
```

---

## Frontend Pages

### Browse Page `/`

- **FilterBar** — pill/chip filters for Position, Type, Difficulty. Selecting multiple chips within a group = OR. Across groups = AND.
- **SearchInput** — live search, filters card grid by name + description (client-side if <200 techniques, otherwise debounced API call)
- **Technique card grid** — name, position badge, type badge, difficulty badge, first sentence of description
- Click card → navigate to detail page

### Detail Page `/technique/:id`

- Header: name, badges (position, type, difficulty)
- Description paragraph
- Steps — numbered list
- Common Mistakes — bulleted list
- Counters — bulleted list
- **Relationship section** — grouped by relationship type, rendered as linked TechniqueCards:
  - "From here, you can attack with..." (leads_to)
  - "This defends against..." (defends_against)
  - "Escape routes..." (escapes_from)
  - "Countered by..." (counters)
- No visual node graph (D3 etc.) — linked cards only

---

## Seed Data — 20 Techniques

### Techniques

| # | Name | Position | Type | Difficulty |
|---|------|----------|------|------------|
| 1 | Armbar from Guard | Guard | Submission | Beginner |
| 2 | Triangle Choke | Guard | Submission | Intermediate |
| 3 | Omoplata | Guard | Submission | Intermediate |
| 4 | Hip Bump Sweep | Guard | Sweep | Beginner |
| 5 | Scissor Sweep | Guard | Sweep | Beginner |
| 6 | Kimura from Guard | Guard | Submission | Beginner |
| 7 | Rear Naked Choke | Back | Submission | Beginner |
| 8 | Bow and Arrow Choke | Back | Submission | Intermediate |
| 9 | Armbar from Mount | Mount | Submission | Intermediate |
| 10 | Americana | Side Control | Submission | Beginner |
| 11 | Ezekiel Choke | Mount | Submission | Intermediate |
| 12 | Upa Escape | Mount | Escape | Beginner |
| 13 | Elbow-Knee Escape | Mount | Escape | Beginner |
| 14 | Kimura from Side Control | Side Control | Submission | Beginner |
| 15 | Guillotine Choke | Standing | Submission | Beginner |
| 16 | Double Leg Takedown | Standing | Transition | Beginner |
| 17 | Half Guard Sweep (Dogfight) | Half Guard | Sweep | Intermediate |
| 18 | Back Take from Turtle | Turtle | Transition | Intermediate |
| 19 | De La Riva Hook | Open Guard | Control | Advanced |
| 20 | X-Guard Sweep | Open Guard | Sweep | Advanced |

### Key Relationships (seed these in seed.py)

| From | Relationship | To |
|------|-------------|-----|
| Armbar from Guard | leads_to | Triangle Choke |
| Armbar from Guard | leads_to | Omoplata |
| Triangle Choke | leads_to | Omoplata |
| Triangle Choke | leads_to | Armbar from Guard |
| Hip Bump Sweep | leads_to | Kimura from Guard |
| Kimura from Guard | leads_to | Hip Bump Sweep |
| Scissor Sweep | leads_to | Armbar from Guard |
| Back Take from Turtle | leads_to | Rear Naked Choke |
| Back Take from Turtle | leads_to | Bow and Arrow Choke |
| Rear Naked Choke | defends_against | Bow and Arrow Choke |
| Upa Escape | escapes_from | Armbar from Mount |
| Upa Escape | escapes_from | Ezekiel Choke |
| Elbow-Knee Escape | escapes_from | Armbar from Mount |
| Elbow-Knee Escape | escapes_from | Americana |
| Double Leg Takedown | leads_to | Back Take from Turtle |
| Double Leg Takedown | leads_to | Guillotine Choke |
| Guillotine Choke | counters | Double Leg Takedown |
| De La Riva Hook | leads_to | X-Guard Sweep |
| X-Guard Sweep | leads_to | Double Leg Takedown |
| Half Guard Sweep (Dogfight) | leads_to | Back Take from Turtle |

---

## Working with Claude Code

This spec is intentionally self-contained so Claude Code doesn't need to explore the broader monorepo.

### Prompt patterns that work

Always give Claude Code a specific action with explicit file scope — never open-ended exploration tasks.

**✅ Good — directive and bounded:**
```
Read SPEC.md. Implement Day 08 backend tasks 1-4 only (scaffold, models, database setup).
Do not start the frontend. Stop after task 4.
```

```
Read these files only: SPEC.md, backend/src/main.py, backend/src/models/technique.py
Add the /techniques search endpoint. Do not modify other files.
```

**❌ Hangs — no stopping condition:**
```
Review the current project state
Analyze this repository and give me an overview
What has been built so far?
```

### Session strategy

Run Day 08 and Day 09 as **separate Claude Code sessions** — cleaner context, less risk of hanging on a large task.

- Session 1: `Read SPEC.md. Implement Day 08 backend tasks only (tasks 1-9). Stop after all tests pass.`
- Session 2: `Read SPEC.md. Implement Day 09 frontend tasks only (tasks 1-10). Backend is already running on port 8000.`

---

## Implementation Plan

### Day 08 — Backend + Data

1. Scaffold `apps/day08-bjj-encyclopedia/backend/` with `uv init`
2. Install: `fastapi`, `sqlmodel`, `uvicorn`
3. Define SQLModel models (`Technique`, `TechniqueRelationship`)
4. Create database setup (`database.py` — SQLite engine, `create_db_and_tables()`)
5. Implement `technique_service.py`:
   - `get_all(filters, search_query)` 
   - `get_by_id(id)` with relationships
6. Implement routes (`/techniques`, `/techniques/{id}`)
7. Write `seed.py` — all 20 techniques + relationships with full field data
8. Write pytest tests (at minimum: list endpoint, detail endpoint, filter by position)
9. Verify: `uv run seed.py` → `uv run uvicorn src.main:app --reload` → test in browser

### Day 09 — Frontend

1. Scaffold `apps/day08-bjj-encyclopedia/frontend/` with Vite React template
2. Install: `react-router-dom`, configure Tailwind
3. Configure Vite proxy to backend (`/api` → `http://localhost:8000`)
4. Build `FilterBar` component with chip-style filters
5. Build `TechniqueCard` component
6. Build `BrowsePage` — wire up filters + search to API
7. Build `RelationshipGraph` component (grouped linked cards)
8. Build `TechniqueDetailPage` — full detail + relationships
9. Write Vitest tests (FilterBar renders chips, TechniqueCard displays name/badges, BrowsePage renders list)
10. Final pass: mobile responsive check, loading states, empty states

---

## Scope Constraints

- No user accounts or auth
- No visual graph library (D3, React Flow, etc.) — linked cards only
- No video embeds
- No pagination on browse page (20 techniques is fine for a single fetch)
- Mobile responsive but not mobile-first
- CORS configured for localhost dev only

---

## Definition of Done

- [ ] `GET /techniques` returns all 20 seeded techniques
- [ ] Filtering by position, type, difficulty works
- [ ] Search by name/description works
- [ ] `GET /techniques/{id}` returns full detail + relationships
- [ ] Browse page renders technique cards with working filters
- [ ] Detail page shows all fields + relationship cards with working links
- [ ] All pytest tests pass
- [ ] All Vitest tests pass
- [ ] ESLint + Ruff clean
- [ ] PR merged to main
