from fastapi import FastAPI
from app.routes import items
from app.core.database import engine, Base

# Create the database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Helper API",
    description="FastAPI application following the Repository pattern",
    version="1.0.0"
)

# Include routes
app.include_router(items.router)

@app.get("/health")
def health_check():
    return {"status": "healthy"}
