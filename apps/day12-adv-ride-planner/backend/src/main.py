from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import create_db_and_tables


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create database and tables on startup."""
    create_db_and_tables()
    yield


# FastAPI app
app = FastAPI(lifespan=lifespan)

# CORS middleware - allow localhost:5173
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Health check endpoint."""
    return {"message": "ADV Ride Planner API"}


# TODO: Mount routes here when they are created
# app.include_router(routes.router)