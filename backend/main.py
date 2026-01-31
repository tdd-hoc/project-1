from fastapi import FastAPI
from app.api.routes import api_router
from fastapi.middleware.cors import CORSMiddleware
from uvicorn.middleware.proxy_headers import ProxyHeadersMiddleware

app = FastAPI(title="Hotel Management System")

# 2. Thêm middleware này vào NGAY SAU khi tạo app
# Nó giúp Backend nhận diện đúng là đang chạy HTTPS trên Azure
app.add_middleware(ProxyHeadersMiddleware, trusted_hosts=["*"])

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",      # Local React
    "http://127.0.0.1:5173",      # Local React (alternative)
    # Add your Azure Frontend URL here later
    "https://hms-frontend.agreeableforest-b96f281c.eastasia.azurecontainerapps.io"
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