# URL Shortener Backend

FastAPI backend for the URL shortener service.

## Setup

```bash
# Install dependencies using uv
uv pip install -e ".[dev]"
```

## Development

```bash
# Run the development server
uvicorn src.main:app --reload --port 8000

# Run tests
pytest

# Lint
ruff check src/ tests/

# Format check
ruff format --check src/ tests/

# Auto-format
ruff format src/ tests/
```

## API Endpoints

- `POST /api/shorten` - Create a shortened URL
- `GET /api/urls` - List all shortened URLs
- `GET /{short_code}` - Redirect to original URL
- `GET /` - Health check

## Example Usage

```bash
# Create a short URL
curl -X POST http://localhost:8000/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'

# List all URLs
curl http://localhost:8000/api/urls

# Redirect (will return 307 redirect)
curl -L http://localhost:8000/abc123
```
