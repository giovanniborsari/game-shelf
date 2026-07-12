from fastapi import FastAPI, Query, Depends
from database import SessionLocal
from models import *
from pydantic import BaseModel
from datetime import datetime
from users import add_user
from password import _check_pwd
from auth_handler import encode_jwt, get_user_id_from_token
from jwt_bearer import GameShelfBearer
from lists_methods import *
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import or_

class FormattedItem(BaseModel):
    game_id: int
    game_title: str
    game_platforms: str | None
    game_genre: str | None
    game_rating: float | None
    game_release_date: datetime | None
    game_description: str | None
    game_cover: str | None
    game_art:str | None

class FormattedUserRegister(BaseModel):
    username: str
    email: str
    password: str
    bio: str | None = None
    picture: str | None = None

class FormattedPWDRequest(BaseModel):
    username: str
    password: str

class FormattedAddItemCollection(BaseModel):
    item_id: int
    item_rating: int | None = None
    notes: str | None = None
    played: bool |None = False

class FormattedAddItemWishlist(BaseModel):
    item_id: int
    user_id: int
    platform: str | None = None

class FormattedWishlistItem(BaseModel):
    wishlist_user: str
    item_name: str
    item_cover: str | None
    release: datetime | None = None
    date: datetime | None = None
    item_rating: float | None
    bought: bool | None = False

class FormattedCollectionItem(BaseModel):
    collection_user: str
    item_name: str
    item_cover: str | None
    release: datetime | None = None
    date: datetime | None = None
    item_rating: float | None
    user_rating: float | None
    played: bool | None = False

class FormattedUser(BaseModel):
    username: str
    bio: str|None = None
    profile_pic: str
    created: datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Game Shelf is running!"} 

@app.post("/auth/register")
def register_user(request: FormattedUserRegister):

    success, message = add_user(
        request.username,
        request.email,
        request.password,
        request.bio, #type: ignore
        request.picture #type: ignore
    )

    try:
        database= SessionLocal()
        if success:
            user = database.query(User).filter(User.\
                                        username == request.username).first()
            return encode_jwt(user.user_id) #type: ignore
        else:
            return {"Error": f"{message}"}
    finally:
        database.close()


@app.post("/auth/login")
def user_login (request : FormattedPWDRequest):
    success = _check_pwd(
        request.username,
        request.password
    )

    try:
        database = SessionLocal()
        if success:
            user = database.query(User).filter(User.\
                                        username == request.username).first()
            return encode_jwt(user.user_id) #type: ignore
        else:
            return {"Error": "Wrong username or password. Try Again!"}
    finally:
        database.close()

@app.get("/items/")
def get_items(page:int = 1, 
              limit: int = 36,
              search: str|None = None,
              platform: str|None = None,
              genre: str|None = None,
              min_rating: float|None = None,
              max_rating: float|None = None):
    
    skip = (page - 1) * limit
    database = SessionLocal()
    formatted_items = []

    try:        
        query = database.query(Items)

        #Filtering options
        if search:
            query = query.filter(Items.item_name.ilike(f"%{search}%"))       
        if platform:
            platform_list = platform.split(',')
            query = query.filter(
                or_(*[Items.platform.ilike(f"{p}") for p in platform_list])
        )
        if genre:
            genre_list = genre.split(',')
            query = query.filter(
                or_(*[Items.genre.ilike(f"%{g}%") for g in genre_list])
        )
        if min_rating is not None:
            query = query.filter(Items.rating >= min_rating)
        if max_rating is not None:
            query = query.filter(Items.rating <= max_rating)

        items = query.offset(skip).limit(limit).all()
        
        for item in items:
            new_item = FormattedItem(
                game_id = item.item_id, #type:ignore
                game_title = item.item_name, #type: ignore
                game_platforms = item.platform, #type: ignore
                game_genre = item.genre, #type: ignore
                game_rating = item.rating, #type: ignore
                game_release_date = item.release_date, #type: ignore
                game_description = item.description, #type: ignore
                game_cover = item.small_cover, #type: ignore
                game_art= item.art #type: ignore
                )
            
            formatted_items.append(new_item) #type: ignore

        total = query.count()

        return {
        "items": formatted_items,
        "total": total,
        "page": page,
        "pages": (total + limit - 1) // limit
        }
    finally:
        database.close()
        
@app.get("/items/get_id/{id}")
def get_item_id(id: int):
    database = SessionLocal()
    item = database.query(Items).filter(Items.item_id == id).first()

    try:
        if item is not None:
            desired_game = FormattedItem(
                game_id = item.item_id, #type:ignore
                game_title = item.item_name, #type: ignore
                game_platforms = item.platform, #type: ignore
                game_genre = item.genre, #type: ignore
                game_rating = item.rating, #type: ignore
                game_release_date = item.release_date, #type: ignore
                game_description = item.description, #type: ignore
                game_cover = item.big_cover, #type: ignore
                game_art = item.art #type: ignore
            )
            return desired_game
        else:
            return "Item not found, do you want to add a new game to our database?"
    finally:
        database.close()

@app.get("/items/search/{search}")
def get_item_search(search: str, page:int = 1, limit: int = 36):
    skip = (page - 1) * limit
    database = SessionLocal()
    items = database.query(Items).filter(Items.item_name.ilike(f"%{search}%"))\
        .offset(skip).limit(limit).all()
    formatted_items = []  

    try:
        if items: 
            for item in items:
                new_item = FormattedItem(
                game_id = item.item_id, #type:ignore
                game_title = item.item_name, #type: ignore
                game_platforms = item.platform, #type: ignore
                game_genre = item.genre, #type: ignore
                game_rating = item.rating, #type: ignore
                game_release_date = item.release_date, #type: ignore
                game_description = item.description, #type: ignore
                game_cover = item.small_cover, #type: ignore
                game_art= item.art #type: ignore

                )
            
                formatted_items.append(new_item) #type: ignore

            total = database.query(Items)\
                .filter(Items.item_name.ilike(f"%{search}%")).count()

            return {
            "items": formatted_items,
            "total": total,
            "page": page,
            "pages": (total + limit - 1) // limit
            }   
        else:
            return "Item not found, do you want to add a new game to our database?"
    finally:
        database.close()                                                                             

@app.get("/items/platform/{platform}")
def get_item_platform(platform: str, page:int = 1, limit:int = 36):
    database = SessionLocal()
    skip = (page - 1) * limit
    items = database.query(Items).filter(Items.platform.ilike(f"%{platform}%"))\
        .offset(skip).limit(limit).all()
    formatted_items = []

    try:
        if items:
            for item in items:
                new_item = FormattedItem(
                    game_id = item.item_id, #type:ignore
                    game_title = item.item_name, #type: ignore
                    game_platforms = item.platform, #type: ignore
                    game_genre = item.genre, #type: ignore
                    game_rating = item.rating, #type: ignore
                    game_release_date = item.release_date, #type: ignore
                    game_description = item.description, #type: ignore
                    game_cover = item.small_cover, #type: ignore
                    game_art= item.art #type: ignore
                )
                formatted_items.append(new_item) #type: ignore

            total = database.query(Items)\
                .filter(Items.platform == platform).count()

            return {
            "items": formatted_items,
            "total": total,
            "page": page,
            "pages": (total + limit - 1) // limit
            }
        else:
            return "Item not found, do you want to add a new game to our database?"
    finally:
        database.close()    

@app.post("/collection/add", dependencies=[Depends(GameShelfBearer())])
def add_to_collection(item: FormattedAddItemCollection, 
                      token: str = Depends(GameShelfBearer())):
    
    user_id = get_user_id_from_token(token)
   
    success, message = add_item_collection(user_id, item.item_id,  #type: ignore
                       item.item_rating, item.notes, item.played) #type: ignore
    
    return {"success": success, "message": message}

@app.get("/collection/me", dependencies=[Depends(GameShelfBearer())])
def show_collection_me(token: str = Depends(GameShelfBearer())):

    user_id = get_user_id_from_token(token)

    database = SessionLocal()

    try:
        user = database.query(User).\
            filter(User.user_id == user_id).first() 
        if not user:
            return {"success": False, "message": "User not found"}
        
        collection = database.query(CollectionList).\
            filter(CollectionList.user_id == user_id).all()
        if not collection:
            return {"success": False, "message": "Wishlist is empty"}
        
        formatted_collection = []
        for game in collection:
            item = database.query(Items).filter(Items.item_id == game.item_id).first()
            
            if item:
                collection_game = FormattedCollectionItem(
                    collection_user = user.username, #type:ignore
                    item_name = item.item_name, #type:ignore
                    item_cover = item.big_cover, #type:ignore
                    item_rating = item.rating, #type:ignore
                    release = item.release_date, #type:ignore
                    played = game.played, #type:ignore
                    date = game.date, #type:ignore
                    user_rating = game.user_rating, #type:ignore
                )
                formatted_collection.append(collection_game)

        return {"wishlist": formatted_collection, "total": len(formatted_collection)}
    finally:
        database.close()

@app.post("/wishlist/add", dependencies=[Depends(GameShelfBearer())])
def add_to_wishlist(item: FormattedAddItemWishlist, 
                      token: str = Depends(GameShelfBearer())):
    
    user_id = get_user_id_from_token(token)
   
    success, message = add_item_wishlist(user_id, item.item_id,  #type: ignore
                       item.platform) #type: ignore
    
    return {"success": success, "message": message}

@app.get("/wishlist/me", dependencies=[Depends(GameShelfBearer())])
def show_whishlist_me(token: str = Depends(GameShelfBearer())):

    user_id = get_user_id_from_token(token)

    database = SessionLocal()    
    
    try:
        user = database.query(User).\
            filter(User.user_id == user_id).first() 
        if not user:
            return {"success": False, "message": "User not found"}
        
        wishlist = database.query(Wishlist).\
            filter(Wishlist.user_id == user_id).all()
        if not wishlist:
            return {"success": False, "message": "Wishlist is empty"}
        
        formatted_wishlist = []
        for game in wishlist:
            item = database.query(Items).filter(Items.item_id == game.item_id).first()
            
            if item:
                wishlist_game = FormattedWishlistItem(
                    wishlist_user = user.username, #type:ignore
                    item_name = item.item_name, #type:ignore
                    item_cover = item.big_cover, #type:ignore
                    item_rating = item.rating, #type:ignore
                    release = item.release_date, #type:ignore
                    bought = game.bought, #type:ignore
                    date = game.date #type:ignore
                )
                formatted_wishlist.append(wishlist_game)

        return {"wishlist": formatted_wishlist, "total": len(formatted_wishlist)}
    finally:
        database.close()

@app.get("/user/me", dependencies=[Depends(GameShelfBearer())])
def user_me (token: str = Depends(GameShelfBearer())):

    user_id = get_user_id_from_token(token)

    database = SessionLocal()

    try:
        user = database.query(User).filter(User.user_id == user_id).first()

        if not user:
            return {"success": False, "message": "User not found!"}
        
        user_info = FormattedUser(
            username = user.username, #type: ignore
            bio= user.user_bio, #type: ignore
            profile_pic= user.profile_picture, #type: ignore
            created= user.created_at_utc #type: ignore
        )

        return user_info
    
    finally:
        database.close()

#--------------------------------Delete Methods---------------------------------
@app.delete("/user/me/delete" , dependencies= [Depends(GameShelfBearer())])
def user_delete (token:str = Depends(GameShelfBearer())):

    user_id = get_user_id_from_token(token)

    database = SessionLocal()

    try:
        user = database.query(User).filter(User.user_id == user_id).first()

        if not user:
            return {"success": False, "message": "User not found!"}
        
        collection = database.query(CollectionList).filter\
            (CollectionList.user_id == user_id).all()
        if collection:
            for game in collection:
                database.delete(game)
                database.commit()

        wishlist = database.query(Wishlist).filter\
            (Wishlist.user_id == user_id).all()
        if wishlist:
            for game in wishlist:
                database.delete(game)
                database.commit()
         
        database.delete(user)
        database.commit()

        return f"User {user.username} deleted!"
    
    finally:
        database.close()

@app.delete("/wishlist/me/delete-all", dependencies= [Depends(GameShelfBearer())])
def delete_wishlist(token: str = Depends(GameShelfBearer())):

    user_id = get_user_id_from_token(token)

    database = SessionLocal()

    try:
        wishlist = database.query(Wishlist).filter(Wishlist.user_id == user_id)\
            .all()
        
        if not wishlist:
            return {"success": False, "message": "Wishlist is empty!"}
        
        for game in wishlist:
            database.delete(game)
            database.commit()

        return "Success, wishlist deleted!"
    finally:
        database.close()
    
@app.delete("/wishlist/me/delete/{game_id}", dependencies= [Depends(GameShelfBearer())])
def delete_wishlist_id(game_id: int, token: str = Depends(GameShelfBearer())):

    user_id = get_user_id_from_token(token)

    database = SessionLocal()

    try:
        wishlist_game = database.query(Wishlist)\
            .filter(Wishlist.user_id == user_id)\
            .filter(Wishlist.item_id == game_id).first()
        
        if not wishlist_game:
            return {"success": False, "message": "Game not found in wishlist!"}
        
        game_name = database.query(Items).filter(Items.item_id == game_id)\
            .first().item_name #type: ignore
        
        database.delete(wishlist_game)
        database.commit()
        
        return f"Success, {game_name} deleted from the wishlist!"
    finally:
        database.close()

@app.delete("/collection/me/delete-all", dependencies= [Depends(GameShelfBearer())])
def delete_collection(token: str = Depends(GameShelfBearer())):

    user_id = get_user_id_from_token(token)

    database = SessionLocal()

    try:
        collection = database.query(CollectionList)\
            .filter(CollectionList.user_id == user_id).all()
        
        if not collection:
            return {"success": False, "message": "Collection is empty!"}
        
        for game in collection:
            database.delete(game)
            database.commit()

        return "Success, collection deleted!"
    finally:
        database.close()
    
@app.delete("/collection/me/delete/{game_id}", dependencies= [Depends(GameShelfBearer())])
def collection_delete_id(game_id: int, token: str = Depends(GameShelfBearer())):

    user_id = get_user_id_from_token(token)

    database = SessionLocal()

    try:
        collection_game = database.query(CollectionList)\
            .filter(CollectionList.user_id == user_id)\
            .filter(CollectionList.item_id == game_id).first()
        
        if not collection_game:
            return {"success": False, "message": "Game not found in wishlist!"}
        
        game_name = database.query(Items).filter(Items.item_id == game_id)\
            .first().item_name #type: ignore
        
        database.delete(collection_game)
        database.commit()
        
        return f"Success, {game_name} deleted from the collection!"
    finally:
        database.close()
