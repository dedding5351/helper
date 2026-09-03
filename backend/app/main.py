import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from routes import items, issues, runbooks, settings, knowledge
from core.database import engine, Base
from fastapi.middleware.cors import CORSMiddleware
from core.seed import seed_data

# Create the database tables
Base.metadata.create_all(bind=engine)

# Seed data on startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup code
    from app.core.database import SessionLocal
    db = SessionLocal()
    try:
        seed_data(db)
        print("Database seeded successfully.")
    except Exception as e:
        print(f"Error seeding data: {e}")
    finally:
        db.close()
        print("closed db connection after seeding.")
    yield
    print("App is shutting down...")
    # Shutdown code (if any)

app = FastAPI(
    title="Helper API",
    description="FastAPI application following the Repository pattern",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware with explicit allowed origins
allowed_origins_raw = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000"
)
allowed_origins = [origin.strip() for origin in allowed_origins_raw.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




# Include routes under /api/v1
app.include_router(items.router, prefix="/api/v1/items")
app.include_router(issues.router, prefix="/api/v1/issues")
app.include_router(runbooks.router, prefix="/api/v1/runbooks")
app.include_router(knowledge.router, prefix="/api/v1/runbooks")
app.include_router(settings.router, prefix="/api/v1/settings")

@app.get("/health")
def health_check():
    return {"status": "healthy"}
