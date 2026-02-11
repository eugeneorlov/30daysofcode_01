from pydantic import BaseModel, HttpUrl


class URLCreate(BaseModel):
    """Request model for creating a shortened URL."""

    url: HttpUrl


class URLResponse(BaseModel):
    """Response model for a shortened URL."""

    short_code: str
    original_url: str
    short_url: str


class URLListResponse(BaseModel):
    """Response model for listing all URLs."""

    urls: list[URLResponse]
