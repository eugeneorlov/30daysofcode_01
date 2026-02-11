from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse

from ..models import URLCreate, URLListResponse, URLResponse
from ..services import URLService

# API router for /api/* endpoints
api_router = APIRouter(prefix="/api", tags=["urls"])

# Redirect router for /{short_code} endpoint (no prefix)
redirect_router = APIRouter(tags=["redirect"])

# Global service instance
url_service = URLService()


@api_router.post("/shorten", response_model=URLResponse, status_code=201)
async def create_short_url(url_data: URLCreate) -> URLResponse:
    """Create a shortened URL."""
    original_url = str(url_data.url)
    short_code = url_service.create_short_url(original_url)

    # For the short_url, we'll use a relative path
    # The frontend can construct the full URL
    short_url = f"/{short_code}"

    return URLResponse(
        short_code=short_code, original_url=original_url, short_url=short_url
    )


@api_router.get("/urls", response_model=URLListResponse)
async def list_urls() -> URLListResponse:
    """List all shortened URLs."""
    all_urls = url_service.list_all_urls()
    urls = [
        URLResponse(short_code=code, original_url=url, short_url=f"/{code}")
        for code, url in all_urls.items()
    ]
    return URLListResponse(urls=urls)


@redirect_router.get("/{short_code}")
async def redirect_to_url(short_code: str) -> RedirectResponse:
    """Redirect from a short code to the original URL."""
    original_url = url_service.get_original_url(short_code)

    if not original_url:
        raise HTTPException(status_code=404, detail="Short URL not found")

    return RedirectResponse(url=original_url, status_code=307)
