from fastapi import FastAPI
from app.api.routes import api_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Hotel Management System")

origins = [
    "http://localhost:5173",      # Local React
    "http://127.0.0.1:5173",      # Local React (alternative)
    # Add your Azure Frontend URL here later
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # Who can connect
    allow_credentials=True,       # Cookies/Tokens
    allow_methods=["*"],          # Allow GET, POST, PUT, DELETE
    allow_headers=["*"],          # Allow all headers
)

app.include_router(api_router)

@app.get("/")
async def root():
    return {"message": "System is live"}