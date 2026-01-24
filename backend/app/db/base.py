from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    """
    all database models will inherit from this class
    it maintains a registry of your tables
    """
    pass