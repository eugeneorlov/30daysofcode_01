## T1: Scaffold pastebin backend
- STATUS: done
- FILES: apps/day10-pastebin/backend/
- VERIFY: cd apps/day10-pastebin/backend && uv run python -c "import fastapi; import sqlmodel; print('OK')"
- CRITIC: skip
- PUSH: gate
- SPEC: Create apps/day10-pastebin/backend/ directory structure.
  Run `uv init` inside it. Add dependencies: fastapi, sqlmodel, uvicorn.
  Create these files:
  - src/__init__.py (empty)
  - src/main.py — FastAPI app with CORS (allow localhost:5173), mount routes, call create_db_and_tables on startup
  - src/database.py — SQLite engine at ./pastebin.db, create_db_and_tables function, get_session dependency
  - .python-version — set to 3.12
  Do NOT create models or routes yet. Just the skeleton that starts with `uv run uvicorn src.main:app`.

## T2: Define SQLModel models
- STATUS: done
- FILES: apps/day10-pastebin/backend/src/models/paste.py
- VERIFY: cd apps/day10-pastebin/backend && uv run python -c "from src.models.paste import Paste; print(Paste.__tablename__)"
- CRITIC: skip
- PUSH: gate
- SPEC: Create src/models/__init__.py and src/models/paste.py.
  Define a Paste SQLModel table:
    - id: int, primary key, auto-increment
    - short_id: str, unique, indexed, 8 chars (generated via secrets.token_urlsafe(6))
    - title: str, optional, default "Untitled"
    - content: str, required
    - language: str, optional, default "plaintext" (for syntax highlighting hint)
    - created_at: datetime, default utcnow
    - expires_at: datetime, optional (nullable)
    - view_count: int, default 0
  Also define Pydantic schemas in the same file:
    - PasteCreate(BaseModel): content (required), title (optional), language (optional), expires_in_minutes (optional int)
    - PasteOut(BaseModel): all fields from Paste except expires_at is optional
    - PasteListItem(BaseModel): short_id, title, language, created_at, view_count (no content for list view)

## T3: Implement paste service and routes
- STATUS: failed
- FILES: apps/day10-pastebin/backend/src/services/paste_service.py, apps/day10-pastebin/backend/src/routes/pastes.py
- VERIFY: cd apps/day10-pastebin/backend && uv run python -c "from src.routes.pastes import router; print(len(router.routes))"
- CRITIC: review
- PUSH: gate
- SPEC: Create src/services/__init__.py, src/services/paste_service.py, src/routes/__init__.py, src/routes/pastes.py.
  Service functions:
    - create_paste(session, data: PasteCreate) -> Paste — generate short_id, calculate expires_at from expires_in_minutes if provided
    - get_paste(session, short_id: str) -> Paste | None — also increment view_count by 1
    - list_recent(session, limit: int = 20) -> list[Paste] — order by created_at desc, exclude expired pastes
    - delete_expired(session) -> int — delete pastes where expires_at < utcnow, return count
  Routes (prefix /api/pastes):
    - POST / — create paste, return PasteOut
    - GET /recent — list recent pastes, return list[PasteListItem]
    - GET /{short_id} — get paste by short_id, return PasteOut, 404 if not found or expired
    - GET /health — return {"status": "ok"}
  Wire the router into main.py with prefix /api/pastes.

## T4: Write backend tests and seed data
- STATUS: failed
- FILES: apps/day10-pastebin/backend/tests/test_pastes.py, apps/day10-pastebin/backend/scripts/seed.py
- VERIFY: cd apps/day10-pastebin/backend && uv run pytest tests/ -v && uv run python scripts/seed.py
- CRITIC: review
- PUSH: gate
- SPEC: Create tests/__init__.py and tests/test_pastes.py.
  Use FastAPI TestClient with an in-memory SQLite override for the session dependency.
  Tests:
    - test_create_paste — POST, verify 200, verify short_id in response
    - test_get_paste — create then GET by short_id, verify content matches
    - test_list_recent — create 3 pastes, GET /recent, verify 3 items returned, no content field
    - test_paste_not_found — GET nonexistent short_id, verify 404
    - test_health — GET /health, verify 200
  Create scripts/seed.py:
    - Seed 5 example pastes with different languages (python, javascript, sql, plaintext, bash)
    - Each paste should have realistic content (a short code snippet or text, 5-15 lines)
    - Run via: uv run python scripts/seed.py

## T5: Scaffold pastebin frontend
- STATUS: done
- FILES: apps/day10-pastebin/frontend/
- VERIFY: cd apps/day10-pastebin/frontend && pnpm build
- CRITIC: skip
- PUSH: gate
- SPEC: Create apps/day10-pastebin/frontend/ using Vite React template.
  Run: cd apps/day10-pastebin && pnpm create vite frontend -- --template react
  Then:
    - cd frontend && pnpm install
    - pnpm add react-router-dom highlight.js
    - pnpm add -D tailwindcss @tailwindcss/vite
  Configure:
    - vite.config.js: add tailwind plugin, add proxy: "/api" -> "http://localhost:8000"
    - src/index.css: add @import "tailwindcss" at top
    - package.json: add "name": "day10-pastebin-frontend"
  Create minimal App.jsx with React Router:
    - "/" -> BrowsePage (placeholder div)
    - "/new" -> CreatePage (placeholder div)
    - "/:shortId" -> ViewPage (placeholder div)
  Verify: pnpm build completes without errors.

## T6: Build CreatePage — new paste form
- STATUS: failed
- FILES: apps/day10-pastebin/frontend/src/pages/CreatePage.jsx, apps/day10-pastebin/frontend/src/components/CodeEditor.jsx
- VERIFY: cd apps/day10-pastebin/frontend && pnpm build
- CRITIC: review
- PUSH: gate
- SPEC: Create src/pages/CreatePage.jsx and src/components/CodeEditor.jsx.
  CodeEditor component:
    - A textarea with monospace font (font-mono), dark background (bg-gray-900 text-gray-100)
    - Props: value, onChange, placeholder
    - Min height 300px, full width, resize-y
  CreatePage:
    - Title input (optional, placeholder "Untitled")
    - Language dropdown: plaintext, javascript, python, sql, bash, typescript, html, css, json, markdown
    - Expiration dropdown: Never, 10 minutes, 1 hour, 24 hours, 7 days
    - CodeEditor for content
    - "Create Paste" button — POST to /api/pastes, on success navigate to /:shortId
    - Loading state on button while submitting
    - Error display if API fails
  Style with Tailwind. Dark theme: bg-gray-950 text-gray-100. Max-width container centered.

## T7: Build ViewPage — paste detail with syntax highlighting
- STATUS: failed
- FILES: apps/day10-pastebin/frontend/src/pages/ViewPage.jsx, apps/day10-pastebin/frontend/src/components/CodeBlock.jsx
- VERIFY: cd apps/day10-pastebin/frontend && pnpm build
- CRITIC: review
- PUSH: gate
- SPEC: Create src/pages/ViewPage.jsx and src/components/CodeBlock.jsx.
  CodeBlock component:
    - Props: code (string), language (string)
    - Use highlight.js for syntax highlighting. Import hljs and register common languages.
    - Use useEffect + useRef to highlight the code block after render.
    - Render as <pre><code ref={codeRef} className={`language-${language}`}>{code}</code></pre>
    - Import a highlight.js dark theme CSS (e.g. highlight.js/styles/github-dark.css)
    - Add line numbers via CSS counter (ol > li with counter-increment)
    - Show a "Copy" button in top-right corner that copies code to clipboard
  ViewPage:
    - Fetch paste from /api/pastes/:shortId on mount
    - Show loading spinner while fetching
    - Show 404 message if paste not found
    - Display: title, language badge, created_at formatted, view count
    - CodeBlock with the paste content
    - "New Paste" button linking to /new
    - "Raw" button that shows plain text content in a new tab (just window.open with data:text/plain)
  Style with Tailwind. Same dark theme as CreatePage.

## T8: Build BrowsePage — recent pastes list
- STATUS: failed
- FILES: apps/day10-pastebin/frontend/src/pages/BrowsePage.jsx, apps/day10-pastebin/frontend/src/components/PasteListItem.jsx
- VERIFY: cd apps/day10-pastebin/frontend && pnpm build
- CRITIC: review
- PUSH: gate
- SPEC: Create src/pages/BrowsePage.jsx and src/components/PasteListItem.jsx.
  PasteListItem component:
    - Props: paste (PasteListItem schema from API)
    - Show: title (or "Untitled"), language badge, relative time (e.g. "3 minutes ago"), view count
    - Entire row is a link to /:shortId
    - Hover state: slightly lighter background
  BrowsePage:
    - Fetch recent pastes from /api/pastes/recent on mount
    - Header: "Recent Pastes" + "New Paste" button (link to /new)
    - List of PasteListItem components
    - Loading state while fetching
    - Empty state: "No pastes yet. Create one!" with link to /new
  Add navigation: simple top nav bar in App.jsx with:
    - "Pastebin" title (links to /)
    - "New" button (links to /new)
  Style with Tailwind. Same dark theme.

## T9: Write frontend tests
- STATUS: pending
- FILES: apps/day10-pastebin/frontend/src/__tests__/
- VERIFY: cd apps/day10-pastebin/frontend && pnpm test -- --run
- CRITIC: skip
- PUSH: gate
- SPEC: Set up Vitest with React Testing Library.
  Add vitest config to vite.config.js (test: { environment: 'jsdom', globals: true, setupFiles: './src/setupTests.js' }).
  Add to devDependencies: vitest, jsdom, @testing-library/react, @testing-library/jest-dom.
  Create src/setupTests.js with: import '@testing-library/jest-dom'.
  Add "test": "vitest" to package.json scripts.
  Create src/__tests__/CodeEditor.test.jsx:
    - Renders textarea with placeholder
    - Calls onChange when typed into
  Create src/__tests__/PasteListItem.test.jsx:
    - Renders title and language
    - Links to correct shortId URL
  Create src/__tests__/CodeBlock.test.jsx:
    - Renders code content in a pre/code block

## T10: Polish and update README
- STATUS: pending
- FILES: apps/day10-pastebin/frontend/src/App.jsx, README.md
- VERIFY: cd apps/day10-pastebin/frontend && pnpm build && cd ../../ && grep "day10-pastebin" README.md
- CRITIC: skip
- PUSH: gate
- SPEC: Final polish pass:
  1. In App.jsx: add a footer "Built as part of 30 Days of Code" with small text
  2. In CreatePage: auto-focus the content textarea on mount
  3. In ViewPage: format created_at as "March 25, 2026 at 14:30"
  4. In BrowsePage: implement relative time without a library — write a simple function
     that returns "just now", "X minutes ago", "X hours ago", "X days ago"
  5. Update root README.md: change day10-pastebin status from 🔲 to ✅
  Do NOT modify any other apps or files outside of apps/day10-pastebin/ and README.md.
