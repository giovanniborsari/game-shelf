from models import User
from database import SessionLocal
from password import hash_pwd

def add_user(username: str, email:str, password: str, bio:str, picture:str): 

    #Username and email check
    if username == None:
        return False, "Please enter an username" 
    elif len(username) < 3:
        return False, "Your username cannot be smaller than 3 characters"
    
    if email == None:
        return False, "Please enter an email address!"
    elif email.count("@") != 1:
        return False, "Invalid email address!" 
    elif email.count(".") > 2 or email.count(".") < 1:
        return False, "Invalid email address!"
   
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

