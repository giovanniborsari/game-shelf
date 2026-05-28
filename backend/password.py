import bcrypt
from database import SessionLocal
from models import User

def hash_pwd(password: str, rounds = 12) -> str:
    valid = valid_pwd(password)

    if valid == True:
        password_token = bcrypt.hashpw(password.encode(), bcrypt.gensalt(rounds))
        return password_token.decode('utf-8')
    else:
        exit()


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

def check_pwd(username: str, password: str) -> bool:
    #Start session
    database = SessionLocal()

    #Get user from the database
    user = database.query(User).filter(User.username == username).first()
    
    #Check if user exists
    if user is None:
        return False
    
    user_token = user.password_token
    
    #Check if password matches
    if bcrypt.checkpw(password.encode(), user_token.encode()):
        return True
    else:
        return False    
    
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
