from passlib.context import CryptContext
from jose import jwt
from app.core.config import settings
from datetime import timezone, datetime, timedelta

# setup password hashing configuration

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password:str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)
 
# create token
def create_access_token(data: dict):
    to_encode = data.copy()

    #dung settings để gắn phút đã được khai báo ở trong file và sử dụng timezone để tránh được lỗi so sánh thời gian không có múi giờ với thời gian có múi giờ sẽ gây cảnh báo hoặc lỗi
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encode_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

    return encode_jwt
