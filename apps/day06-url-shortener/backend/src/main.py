from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes import api_router, redirect_router

app = FastAPI(
    title="URL Shortener API",
    description="A simple URL shortening service",
    version="1.0.0",
)

# Configure CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite default dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(api_router)
app.include_router(redirect_router)


@app.get("/")
async def root() -> dict[str, str]:
    """Health check endpoint."""
    return {"status": "ok", "message": "URL Shortener API"}
