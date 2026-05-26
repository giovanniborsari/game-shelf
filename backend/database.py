from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from dotenv import load_dotenv
import os

load_dotenv() #reads .env file and loads it to python

DATABASE_URL = os.getenv("DATABASE_URL") #fetches the database URL from .env

engine = create_engine(DATABASE_URL) #Creates the connection to PostSQL

SessionLocal = sessionmaker(bind=engine) #Creates a communication between the database and python

class Base(DeclarativeBase): #inherits DeclarativeBase that turns Python classes into database tables
    pass

