from models import User
from database import SessionLocal
from password import hash_pwd
import validators


def add_user(username: str, email:str, password: str, bio:str, picture:str): 
    """ 
    Adds a new user to the database after validating credentials

    Args:
        username (str): User's nickname. Must be at least 3 characters
        email (str): Account's email address
        password (str): Account's password (will be hashed before stored)
        bio (str): Account's profile bio/short text
        picture (str): URL link to the account's profile picture

    Return:
        tuple (bool, str): A tuple where the first item is a boolean indicating 
        success (True). 
        or failure (False), and the second item is a descriptive message.
    """
    #Username check
    if username == None:
        return False, "Please enter an username" 
    elif len(username) < 3:
        return False, "Your username cannot be smaller than 3 characters"
    
    #Check if email in None
    if email == None:
        return False, "Please enter an email address!"
    #Check if email is valid
    if not validators.email(email):
        return False, "Please enter an valid email address!"
   
    #Open a session workspace
    database = SessionLocal()

    try:
        #Search username in the actual database, return False if search == None
        search_user = database.query(User).filter(User.username == username)\
            .first() is not None
        if search_user:
            return False, "Username already being used!"
        
        #Search email in the actual database, return False if search == None
        search_email = database.query(User).filter(User.email == email)\
            .first() is not None
        
        if search_email:
            return False, "Email already being used!"
        
        #Create new user
        new_user = User(
            username= username,
            email= email,
            password_token = hash_pwd(password), 
            user_bio = bio,
            profile_picture = picture
        )

        #Add and Commit new user to the database
        database.add(new_user)
        database.commit()

        return True, (f"User {username} created!")
    
    #Catch an unexpect exceptio rollback the database keeping it clean
    except Exception as e:
        database.rollback()
        return False, f"Database error: {e}"
    finally:
        #Closer the database
        database.close()

def update_user(username: str, bio:str, picture:str, user_id: int): 
    """ 
    Updates user in the database after validating credentials

    Args:
        username (str): User's nickname. Must be at least 3 characters
        bio (str): Account's profile bio/short text
        picture (str): URL link to the account's profile picture

    Return:
        tuple (bool, str): A tuple where the first item is a boolean indicating 
        success (True). 
        or failure (False), and the second item is a descriptive message.
    """
    #Username check
    if username == None:
        return False, "Please enter an username" 
    elif len(username) < 3:
        return False, "Your username cannot be smaller than 3 characters"
   
    #Open a session workspace
    database = SessionLocal()

    try:
        search_user = database.query(User).filter(
            User.username == username,
            User.user_id != user_id  # exclude current user
            ).first() is not None
        if search_user:
            return False, "Username already being used!"
        
        #Update user
        user = database.query(User).filter(User.user_id == user_id).first() 

        if user is not None:
            user.user_bio = bio # type: ignore
            user.username = username # type: ignore
            user.profile_picture = picture # type: ignore

        #Commit new user to the database
        database.commit()

        return True, (f"User {username} updated!")
    
    #Catch an unexpect exceptio rollback the database keeping it clean
    except Exception as e:
        database.rollback()
        return False, f"Database error: {e}"
    finally:
        #Closer the database
        database.close()

