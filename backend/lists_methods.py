from models import *
from database import SessionLocal
from datetime import datetime, timezone

def add_item_collection(user_id:int,platform:str|None, game_id:int, 
                        user_rating:int|None,user_notes:str|None, played:bool):

    database = SessionLocal()

    game = database.query(Items).filter(Items.item_id == game_id ).first()
    user = database.query(User).filter(User.user_id == user_id ).first()

    try:
        if not game:
            return False, f"Game id: {game_id} not found, impossible add to collection!"
        
        if not user:
            return False, f"User: {user_id} not found, impossible add to collection!"
        
        existing = database.query(CollectionList).filter(CollectionList.user_id 
                        == user_id,CollectionList.item_id == game_id).first()

        if existing:
            return False, "Game already in your collection!"
        
        raw_rating = game.rating
        if raw_rating is not None:
            game_rating = round(raw_rating) #type: ignore
        else:
            game_rating = None

        date = datetime.now(timezone.utc)

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
        
        database.add(collection_item)
        database.commit()

        return True, f"Game: {game.item_name} added!"
    finally:
        database.close()

def edit_item_collection(user_id:int,platform:str|None, game_id:int, 
                        user_rating:int|None,user_notes:str|None, played:bool):

    database = SessionLocal()

    game = database.query(CollectionList).filter\
    (CollectionList.item_id == game_id,  
    CollectionList.user_id == user_id ).first()
    user = database.query(User).filter(User.user_id == user_id ).first()

    try:
        if not game:
            return False, f"Game id: {game_id} not found, impossible to edit"
        
        if not user:
            return False, f"User: {user_id} not found, impossible to edit!"

        game_title = (database.query(Items).filter
            (Items.item_id == game_id).first()).item_name # type: ignore

        game.platform = platform # type: ignore
        game.user_rating = user_rating # type: ignore
        game.notes = user_notes # type: ignore
        game.played = played # type: ignore
        game.date = datetime.now(timezone.utc) # type: ignore

        database.commit()

        return True, f"Game: {game_title} edited!"
    
    except Exception as e:
        database.rollback()
        return False, f"Error editing game: {e}"
    
    finally:
        database.close()

def add_item_wishlist(user_id:int, game_id:int, platform:str|None):

    database = SessionLocal()

    game = database.query(Items).filter(Items.item_id == game_id ).first()
    user = database.query(User).filter(User.user_id == user_id ).first()
    
    try:
        if not game:
            return False, f"Game id: {game_id} not found, impossible add to collection!"
        
        if not user:
            return False, f"User: {user_id} not found, impossible add to collection!"
        
        existing = database.query(Wishlist).filter(Wishlist.user_id 
                        == user_id,Wishlist.item_id == game_id).first()

        if existing:
            return False, "Game already in your wishlist!"
    
        raw_rating = game.rating 
        if raw_rating is not None:
            game_rating = round(raw_rating) #type: ignore
        else:
            game_rating = None

        date = datetime.now(timezone.utc)

        wishlist_item = Wishlist(
            user_id = user_id,
            item_id = game_id,
            platform = platform,
            rating = game_rating,
            bought = False,
            date = date
        )

        database.add(wishlist_item)
        database.commit()

        return True, f"Game: {game.item_name} added!"
    
    finally:
        database.close()

def edit_item_wishlist(user_id:int, game_id:int, platform:str|None, 
                       bought:bool|None):

    database = SessionLocal()

    game = database.query(Wishlist).filter\
        (Wishlist.item_id == game_id,  
        Wishlist.user_id == user_id ).first()
    user = database.query(User).filter(User.user_id == user_id ).first()
    
    try:
        if not game:
            return False, f"Game id: {game_id} not found, impossible to edit!"
        
        if not user:
            return False, f"User: {user_id} not found, impossible to edit!"

        game_title = (database.query(Items).filter
                    (Items.item_id == game_id).first()).item_name # type: ignore
        
        if bought is None:
            bought = False
        
        game.platform = platform #type: ignore
        game.date = datetime.now(timezone.utc) #type: ignore
        game.bought = bought #type: ignore
        
        database.commit()

        return True, f"Game: {game_title} edited!"
    
    finally:
        database.close()