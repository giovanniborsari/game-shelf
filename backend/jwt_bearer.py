from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from auth_handler import decode_jwt

class GameShelfBearer(HTTPBearer):
    """
    Custom JWT Bearer authentification barrier for protected routes.
    Used to validate the bearer token before allowing access to protected routes
    """
    def __init__(self, auto_error: bool = True):
        """
        Initializes the authentification guard.

        Args:
            auto_error: If True it automatically returns a 403 Error when no 
            credentials are present.
        """
        super(GameShelfBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        """
        Runs every time a protected route is requested  before the endpoint 
        executes.
        Extracts the Authorization header, check if the scheme is "Bearer", and 
        validates the token. 
        Raises a 403 Error and print a descriptive message if anything goes 
        wrong.

        Args:
            request (Request): The incoming HTTP request

        Returns:
            token(str): the validated jwt token
        """

        #Extracts the token from authorization header
        credentials: HTTPAuthorizationCredentials = \
            await super(GameShelfBearer, self).__call__(request) #type: ignore
        
        #Check if credentials is not None or empty
        if credentials:
            #Check the scheme, must be "Bearer"
            if not credentials.scheme == "Bearer":
                #Error 403 if scheme is not "Bearer"
                raise HTTPException(status_code=403, detail=\
                        "Invalid authentication scheme. It must be \"Bearer\"")
            #Error 403 if verify_jwt returns false
            if not self.verify_jwt(credentials.credentials):
                raise HTTPException(status_code=403,\
                                     detail="Invalid token or expired token.")
            
            #Returns validated jwt token
            return credentials.credentials
        else:
            #Error 403 if credentials was None 
            raise HTTPException\
                (status_code=403, detail="Invalid authorization code.")
        

    def verify_jwt(self, token: str) -> bool:
        """
        Verify if the JWT token is valid and not expired.
        Passes the token to decode_jwt and checks if a valid payload is returned. 
        An empty dict or None means the token is invalid or expired.

        Args:
            token (str): The JWT token string to verify

        Returns:
            bool: True if token is valid, False otherwise
        """
        try:
            #Decode the token
            payload = decode_jwt(token)
            #Check if payload is empty or None
            if not payload:
                #Return false if it is 
                print("Token invalid or expired, try to log in again!")
                return False
            return True
        #Get any unexpected exceptions
        except Exception as e:
            print(f"Something went wrong during token validation: {e}")
            return False

   

        