import bcrypt
from database import SessionLocal
from models import User
from datetime import datetime, timezone, timedelta

def hash_pwd(password: str, rounds = 12) -> str|bool:
    valid = valid_pwd(password)

    if valid == True:
        password_token = bcrypt.hashpw(password.encode(), bcrypt.gensalt(rounds))
        return password_token.decode('utf-8')
    else:
        return False


def valid_pwd(password: str) -> bool:
    #Password must contain at least 8 characters 
    if len(password) < 8:
        print("Password must contain at least 8 characters")
        return False
    elif password.count(" "):
        print("Password cannot contain spaces")
        return False
    elif count_digits(password) < 1:
        print("Password must contain at least one digit")
        return False
    elif count_special(password) < 1:
        print("Password must contain at least one special character")
        return False
    else:
        return True

def _check_pwd(username: str, password: str) -> bool:
    #Start session
    database = SessionLocal()

    #Get user from the database
    user = database.query(User).filter(User.username == username).first()
    
    #Check if user exists
    if user is None:
        return False
    
    #Check if account is locked
    if _account_lock(username) == True:
        return False

    user_token = user.password_token
    
    #Check if password matches
    if bcrypt.checkpw(password.encode(), user_token.encode()):
        return True
    else:
        _attempt_track(username)
        return False

def _attempt_track(username: str):

    #Start session
    database = SessionLocal()

    #Get user from the database
    user = database.query(User).filter(User.username == username).first()

    #Ignore warning, we checked if user is none before getting here
    user.last_attempt = datetime.now(timezone.utc)# type: ignore
    user.password_attempts += 1 # type: ignore
    
    database.add(user)
    database.commit()
    database.close()

def _account_lock(username) -> bool:
  
    #Start session
    database = SessionLocal()

    #Get user from the database
    user = database.query(User).filter(User.username == username).first()

    #Ignore warning, we checked if user is none before getting here
    if user.last_attempt is not None: #type: ignore
        
        #Calculate time difference between now nad last attempt
        duration = (datetime.now(timezone.utc) 
                - user.last_attempt) #type: ignore
        
        #Reset user attempts and last attempt if duration is larger than 1 hour
        if duration.total_seconds() > 3600:
            user.last_attempt = None #type: ignore
            user.password_attempts = 0 #type: ignore
            return False
        
        #5 errors account locked for 1 hour
        elif user.password_attempts >= 5 and duration.total_seconds() < 3600: #type: ignore
            unlock = user.last_attempt + timedelta(hours=1) #type: ignore
            print(f"Account is locked until: {unlock}")
            return True
        
        #3 errors account locked for 15 minutes
        elif user.password_attempts >= 3 and duration.total_seconds() < 900: #type: ignore
            unlock = user.last_attempt + timedelta(minutes=15) #type: ignore
            print(f"Account is locked until: {unlock}")
            return True
        
    return False
#--------------------------------Helper Methods--------------------------------
def count_digits(password: str) -> int:
    count = 0

    #Iterate the password and add 1 to count if it finds a digit
    for index in password:
        if index.isdigit():
            count += 1

    return count

def count_special(password: str) -> int:
    count = 0

    #Iterate the password and add 1 to count if it finds an special character
    for index in password:
        if not index.isalnum():
            count += 1

    return count

