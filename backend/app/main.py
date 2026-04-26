from fastapi import FastAPI
from app.routes import items, issues, runbooks, settings
from app.core.database import engine, Base
from fastapi.middleware.cors import CORSMiddleware
from app.core.seed import seed_data

# Create the database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Helper API",
    description="FastAPI application following the Repository pattern",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Seed data on startup
@app.on_event("startup")
def startup_event():
    from app.core.database import SessionLocal
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()

# Include routes under /api/v1
app.include_router(items.router, prefix="/api/v1/items")
app.include_router(issues.router, prefix="/api/v1/issues")
app.include_router(runbooks.router, prefix="/api/v1/runbooks")
app.include_router(settings.router, prefix="/api/v1/settings")

@app.get("/health")
def health_check():
    return {"status": "healthy"}
