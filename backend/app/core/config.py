from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str 
    ALGORITHM: str = "HS256" # Có thể set mặc định
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30 # Pydantic tự ép kiểu về int
    SECRET_KEY: str
    DB_PASSWORD: str
    DB_NAME: str
    
    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'

settings = Settings()
