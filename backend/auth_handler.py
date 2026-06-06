import time
from typing import Dict
import jwt
from dotenv import load_dotenv
import os
import binascii

load_dotenv() #reads .env file and loads it to python

SECRET_JWT = os.getenv("S_JWT")
SECRET_ALG = os.getenv("S_ALG")

def ret_token(token: str):
    return {
        "access_token": token
    }

def encode_jwt(user_id: int) -> Dict[str,str]:

    payload = {
        "user_id": str(user_id),
        "expires": time.time() + 600
    }

    #Creates a safe url string
    token = jwt.encode(payload, SECRET_JWT, algorithm = SECRET_ALG) #type:ignore

    return ret_token(token)

def decode_jwt(token: str) -> dict:
    try:
        #Decode token 
        decoded = jwt.decode(token, SECRET_JWT, algorithms=[SECRET_ALG]) #type: ignore

        #Check if the token is still valid
        if decoded["expires"] >= time.time():
            return decoded
        else:
            return None #type: ignore
    except:
        #Returns an empty token if something doesn't work, instead of crashing
        return {}
        
def get_user_id_from_token(token: str) -> int|None :
    """
    Gets the id of the user making the protected route request.

    Args:
        token(str): JWT token string
        
    Return: 
        int: The user's ID if token is valid
        None: If token is invalid or expired
    """
    #Decode the token
    payload = decode_jwt(token)

    if payload:
        #Return user id if payload is not empty or None
        return payload.get("user_id")
        
    return None
