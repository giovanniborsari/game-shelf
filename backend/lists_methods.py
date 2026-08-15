from models import *
from database import SessionLocal
from datetime import datetime, timezone

"""
    Adds an item to collection if the user is authentified

    Args:
        user_id (int): User's unique identification number
        platform (str): Game's platform selected by the user
        game_id (int) : Game's unique  identification number
        user_rating (int) : Rating that the user assigns to the game
        user_notes (str) : Notes/ Review user writes to the game
        played (bool) : Shows if the user played the game or no
        
    Return: 
        dict: Return True and the game name if it was succesfully added to the
        collection 
              Return False if the game already is in the collection, if the game
        id is not in the database, or if the user id is not in the database
"""
def add_item_collection(user_id:int,platform:str|None, game_id:int, 
                        user_rating:int|None,user_notes:str|None, played:bool):

    #Starts the database
    database = SessionLocal()

    #Gets the game and the user from the database
    game = database.query(Items).filter(Items.item_id == game_id ).first()
    user = database.query(User).filter(User.user_id == user_id ).first()

    try:
        #Check if the game was found
        if not game:
            return False, f"Game id: {game_id} not found, impossible add to collection!"
        #Check if the user was found
        if not user:
            return False, f"User: {user_id} not found, impossible add to collection!"

        #Check if the game already is in the database
        existing = database.query(CollectionList).filter(CollectionList.user_id 
                        == user_id,CollectionList.item_id == game_id).first()

        if existing:
            return False, "Game already in your collection!"

        #Rounds the rating assigned by the user, if the user assigns it
        raw_rating = game.rating
        if raw_rating is not None:
            game_rating = round(raw_rating) #type: ignore
        else:
            game_rating = None

        date = datetime.now(timezone.utc)

        #Creates a new collection item
        collection_item = CollectionList(
            item_id = game_id,
            user_id = user_id, 
            rating = game_rating,
            user_rating = user_rating,
            notes = user_notes,
            played = played, 
            date = date,
            platform= platform
        )

        #Add the item to the database and commits it
        database.add(collection_item)
        database.commit()

        #Returns true and the game name
        return True, f"Game: {game.item_name} added!"
    #Always close the database
    finally:
        database.close()

"""
    Edits an item to collection if the user is authentified

    Args:
        user_id (int): User's unique identification number
        platform (str): Game's platform selected by the user
        game_id (int) : Game's unique  identification number
        user_rating (int) : Rating that the user assigns to the game
        user_notes (str) : Notes/ Review user writes to the game
        played (bool) : Shows if the user played the game or no
        
    Return: 
        dict: Return True and the game name if it was succesfully edited to the
        collection 
              Return False if the game already is in the collection or if the 
              game id is not in the database
"""
def edit_item_collection(user_id:int,platform:str|None, game_id:int, 
                        user_rating:int|None,user_notes:str|None, played:bool):

    #Starts the database
    database = SessionLocal()

    #Gets the game from the database
    game = database.query(CollectionList).filter\
    (CollectionList.item_id == game_id,  
    CollectionList.user_id == user_id ).first()

    #Gets the user from the database
    user = database.query(User).filter(User.user_id == user_id ).first()

    try:
        #Return false if the game was not found
        if not game:
            return False, f"Game id: {game_id} not found, impossible to edit"

        #Return false if the user was not found
        if not user:
            return False, f"User: {user_id} not found, impossible to edit!"

        #Gets the game title from the datase
        game_title = (database.query(Items).filter
            (Items.item_id == game_id).first()).item_name # type: ignore

        #Modify the existing collection item
        game.platform = platform # type: ignore
        game.user_rating = user_rating # type: ignore
        game.notes = user_notes # type: ignore
        game.played = played # type: ignore
        game.date = datetime.now(timezone.utc) # type: ignore

        #Commits the changes
        database.commit()

        #Returns true if the game was succesfully edited
        return True, f"Game: {game_title} edited!"

    #Catch any unexpected expetions
    except Exception as e:
        database.rollback()
        return False, f"Error editing game: {e}"

    #Always close the database
    finally:
        database.close()

"""
    Adds an item to wishlist if the user is authentified

    Args:
        user_id (int): User's unique identification number
        platform (str): Game's platform selected by the user
        game_id (int) : Game's unique  identification number
        
    Return: 
        dict: Return True and the game name if it was succesfully added to the
        wishlist 
              Return False if the game already is in the wishlist, if the 
              game id is not in the database, or if the user was not found
"""
def add_item_wishlist(user_id:int, game_id:int, platform:str|None):

    #Starts the database
    database = SessionLocal()

    #Gets the game and the user from the database
    game = database.query(Items).filter(Items.item_id == game_id ).first()
    user = database.query(User).filter(User.user_id == user_id ).first()
    
    try:
        #Check if the game was found
        if not game:
            return False, f"Game id: {game_id} not found, impossible add to collection!"

        #Check if the user was found
        if not user:
            return False, f"User: {user_id} not found, impossible add to collection!"

        #Check if the game exists
        existing = database.query(Wishlist).filter(Wishlist.user_id 
                        == user_id,Wishlist.item_id == game_id).first()

        if existing:
            return False, "Game already in your wishlist!"

        #Rounds the official game rating 
        raw_rating = game.rating 
        if raw_rating is not None:
            game_rating = round(raw_rating) #type: ignore
        else:
            game_rating = None

        date = datetime.now(timezone.utc)

        #Creates a new wishilist item
        wishlist_item = Wishlist(
            user_id = user_id,
            item_id = game_id,
            platform = platform,
            rating = game_rating,
            bought = False,
            date = date
        )

        #Adds and commit the new item
        database.add(wishlist_item)
        database.commit()

        #Return true and the game name 
        return True, f"Game: {game.item_name} added!"

    #Always closes the database
    finally:
        database.close()

"""
    Edits an item in the wishlist if the user is authentified

    Args:
        user_id (int): User's unique identification number
        platform (str): Game's platform selected by the user
        game_id (int) : Game's unique  identification number
        bought (bool) : Flags if the user bought the game or no
        
    Return: 
        dict: Return True and the game name if it was succesfully edited to the
        wishlist 
              Return False if the game already is in the collection or if the 
              game id is not in the database
"""
def edit_item_wishlist(user_id:int, game_id:int, platform:str|None, 
                       bought:bool|None):
    #Starts the database
    database = SessionLocal()

    #Gets the game and user from the database
    game = database.query(Wishlist).filter\
        (Wishlist.item_id == game_id,  
        Wishlist.user_id == user_id ).first()
    user = database.query(User).filter(User.user_id == user_id ).first()
    
    try:
        #Check if the game was found
        if not game:
            return False, f"Game id: {game_id} not found, impossible to edit!"
        #Check if the user was found
        if not user:
            return False, f"User: {user_id} not found, impossible to edit!"

        #Gets the game title
        game_title = (database.query(Items).filter
                    (Items.item_id == game_id).first()).item_name # type: ignore

        #If bought is not assigned by the user it is set as False
        if bought is None:
            bought = False

        #Edit the item information
        game.platform = platform #type: ignore
        game.date = datetime.now(timezone.utc) #type: ignore
        game.bought = bought #type: ignore

        #Commit the changes
        database.commit()

        #Return True
        return True, f"Game: {game_title} edited!"

    #Always closes the database
    finally:
        database.close()