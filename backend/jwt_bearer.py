from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from auth_handler import decode_jwt

class GameShelfBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super(GameShelfBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        credentials: HTTPAuthorizationCredentials = \
            await super(GameShelfBearer, self).__call__(request) #type: ignore
        if credentials:
            if not credentials.scheme == "Bearer":
                raise HTTPException(status_code=403, detail=\
                        "Invalid authentication scheme. It must be \"Bearer\"")
            if not self.verify_jwt(credentials.credentials):
                raise HTTPException(status_code=403,\
                                     detail="Invalid token or expired token.")
            return credentials.credentials
        else:
            raise HTTPException\
                (status_code=403, detail="Invalid authorization code.")
        

    def verify_jwt(self, token: str) -> bool:
        try:
            payload = decode_jwt(token)
            if not payload:
                print("Token invalid or expired, try to log in again!")
                return False
            return True
        except Exception as e:
            print(f"Something went wrong during token validation: {e}")
            return False

    def get_user_id_from_token(self, token: str) -> int|None :
        payload = decode_jwt(token)

        if payload:
            return payload.get("user_id")
        
        return None

        