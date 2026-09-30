from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes_upload import router as upload_router
from app.api.routes_analysis import router as analysis_router
from app.api.routes_reports import router as reports_router

app = FastAPI(
    title="ChatBreaker API",
    description="Privacy-First WhatsApp Conversation Analytics & Visualization Engine",
    version="1.0.0"
)

# Enable CORS for local Vite development and deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routes
app.include_router(upload_router, prefix="/api")
app.include_router(analysis_router, prefix="/api")
app.include_router(reports_router, prefix="/api")

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "ChatBreaker Engine",
        "version": "1.0.0",
        "privacy": "local-first-compliant"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
