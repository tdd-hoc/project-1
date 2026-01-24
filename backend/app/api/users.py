from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserRead
from app.core.sercurity import get_password_hash

router = APIRouter()

@router.post("/signup", response_model=UserRead)
async def create_user(user: UserCreate, db:  AsyncSession = Depends(get_db)):
    # check if email already exists
    result = await db.execute(select(User).where(User.email == user.email))
    exsiting_user = result.scalar_one_or_none()

    if exsiting_user:
        raise HTTPException(status_code=400, detail="email already registered")
    #hash the password
    hased_pwd = get_password_hash(user.password)
    
    #save user to DB

    new_user = User(
        email=user.email,
        full_name=user.full_name,
        hashed_password=hased_pwd
    )

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    return new_user



