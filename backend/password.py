import bcrypt
from database import SessionLocal
from models import User
from datetime import datetime, timezone, timedelta

def hash_pwd(password: str, rounds = 12) -> str|bool:
    """ 
    Hash password if it contains all the requirements

    Args:
        password (str): User's password
        rounds (int): Encryptation level

    Return:
        password_token(str): Password's hashed token if success (True) 
        or failure (False).
    """
    valid = valid_pwd(password)

    if valid == True:
        password_token = bcrypt.hashpw(password.encode(), bcrypt.gensalt(rounds))
        return password_token.decode('utf-8')
    else:
        return False


def valid_pwd(password: str) -> bool:
    """ 
    Validate account's password
    Args:
        password (str): User's password

    Return:
        True: If password meets all the requirements
        or False, if it fails in any of them.
    """
    
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
    
    """ 
    Check if password inserted is the same as the hashed token in the database

    Args:
        username (str): Account's username
        password (str): User's password

    Return:
        True: If password is right
        or False, if it username was not found, or password was incorrect, or 
        account was locked.
    """
     
    #Start session
    database = SessionLocal()

    #Get user from the database
    user = database.query(User).filter(User.username == username).first()
    
    try:
        #Check if user exists
        if user is None:
            return False
        
        #Check if account is locked
        if _account_lock(username) == True:
            return False

        user_token = user.password_token
        
        #Check if password matches
        if bcrypt.checkpw(password.encode(), user_token.encode()):
            user.password_attempts = 0 #type: ignore
            database.commit()
            return True
        else:
            _attempt_track(username)
            return False
    finally:
        database.close()

def _attempt_track(username: str):
    """ 
    Tracks the amount of incorrect login attempts in an account, and updates its
    value in the database.

    Args:
        username (str): Account's username

    """

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
    """ 
    Locks the account for a determined amount of time based on how many wrong 
    passwords were attempted

    - 3 attempts = 15 minutes
    - 5 attempts = 1 hour

    Resets every hour

    Args:
        username (str): Account's username

    """

    #Start session
    database = SessionLocal()

    #Get user from the database
    user = database.query(User).filter(User.username == username).first()

    try:
        #Ignore warning, we checked if user is none before getting here
        if user.last_attempt is not None: #type: ignore
            
            #Calculate time difference between now nad last attempt
            duration = (datetime.now(timezone.utc) 
                    - user.last_attempt.replace(tzinfo= timezone.utc)) #type: ignore
            
            #Reset user attempts and last attempt if duration is larger than 1 hour
            if duration.total_seconds() > 3600:
                user.last_attempt = None #type: ignore
                user.password_attempts = 0 #type: ignore
                database.commit()
                return False
            
            #5 errors account locked for 1 hour
            elif user.password_attempts >= 5 and duration.total_seconds() < 3600: #type: ignore
                unlock = user.last_attempt + timedelta(hours=1) #type: ignore
                print(f"Account is locked until: {unlock}")
                return True
            
            #3 errors account locked for 15 minutes
            elif user.password_attempts == 3 and duration.total_seconds() < 900: #type: ignore
                unlock = user.last_attempt + timedelta(minutes=15) #type: ignore
                print(f"Account is locked until: {unlock}")
                return True
        return False
    finally:
        database.close()
        
#--------------------------------Helper Methods--------------------------------
def count_digits(password: str) -> int:
    """ 
    Helper Method for valid_pwd():
    Counts the amount of digits in the users password.

    Args:
        password (str): User's password

    Return:
        return the count of digits in the password

    """
    count = 0

    #Iterate the password and add 1 to count if it finds a digit
    for index in password:
        if index.isdigit():
            count += 1

    return count

def count_special(password: str) -> int:
    """ 
    Helper Method for valid_pwd():
    Counts the amount of special characters in the users password.

    Args:
        password (str): User's password

    Return:
        return the count of special characters in the password

    """

    count = 0

    #Iterate the password and add 1 to count if it finds an special character
    for index in password:
        if not index.isalnum():
            count += 1

    return count
