from fastapi import FastAPI
from app.routes import items

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
