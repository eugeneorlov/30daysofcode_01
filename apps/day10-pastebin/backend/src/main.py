from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .database import create_db_and_tables
from .routes.pastes import router as pastes_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler."""
    # Startup
    create_db_and_tables()
    yield
    # Shutdown


app = FastAPI(lifespan=lifespan)

# CORS middleware to allow localhost:5173
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routes
app.include_router(pastes_router, prefix="/api/pastes")


@app.get("/")
async def read_root():
    """Health check endpoint."""
    return {"message": "Pastebin API is running"}