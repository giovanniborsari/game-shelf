import time
from typing import Dict
import jwt
from dotenv import load_dotenv
import os

load_dotenv() #reads .env file and loads it to python

SECRET_CLIENT = os.getenv("CLIENT_ID")
SECRET_ALG = os.getenv("ALGORITHM")

def ret_token(token: str):
    return {
        "access_token": token
    }