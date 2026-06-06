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


class FormatedItem(BaseModel):
    game_id: int
    game_title: str
    game_platforms: str | None
    game_genre: str | None
    game_rating: float | None
    game_category: str | None
    game_release_date: datetime | None
    game_description: str | None
    game_cover: str | None

class FormatedUserRegister(BaseModel):
    username: str
    email: str
    password: str
    bio: str | None = None
    picture: str | None = None

class FormatedPWDRequest(BaseModel):
    username: str
    password: str

class FormatedAddItemCollection(BaseModel):
    item_id: int
    item_rating: int | None = None
    notes: str | None = None
    played: bool |None = False


app = FastAPI()

@app.get("/")
def root():
    return {"message": "Game Shelf is running!"} 

@app.post("/auth/register")
def register_user(request: FormatedUserRegister):

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
def user_login (request : FormatedPWDRequest):
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
def get_items(page:int = 1, limit: int = 36):
    skip = (page - 1) * limit
    database = SessionLocal()
    items = database.query(Items).offset(skip).limit(limit).all()
    formatted_items = []

    try:
        for item in items:
            new_item = FormatedItem(
                game_id = item.item_id, #type:ignore
                game_title = item.item_name, #type: ignore
                game_platforms = item.platform, #type: ignore
                game_genre = item.genre, #type: ignore
                game_rating = item.rating, #type: ignore
                game_category = item.categories, #type: ignore
                game_release_date = item.release_date, #type: ignore
                game_description = item.description, #type: ignore
                game_cover = item.cover #type: ignore
                )
            
            formatted_items.append(new_item) #type: ignore

        total = database.query(Items).count()

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
            desired_game = FormatedItem(
                game_id = item.item_id, #type:ignore
                game_title = item.item_name, #type: ignore
                game_platforms = item.platform, #type: ignore
                game_genre = item.genre, #type: ignore
                game_rating = item.rating, #type: ignore
                game_category = item.categories, #type: ignore
                game_release_date = item.release_date, #type: ignore
                game_description = item.description, #type: ignore
                game_cover = item.cover #type: ignore
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
                new_item = FormatedItem(
                game_id = item.item_id, #type:ignore
                game_title = item.item_name, #type: ignore
                game_platforms = item.platform, #type: ignore
                game_genre = item.genre, #type: ignore
                game_rating = item.rating, #type: ignore
                game_category = item.categories, #type: ignore
                game_release_date = item.release_date, #type: ignore
                game_description = item.description, #type: ignore
                game_cover = item.cover #type: ignore
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
def get_item_platform(desired_platform: str, page:int = 1, limit= 36):
    database = SessionLocal()
    skip = (page - 1) * limit
    items = database.query(Items.platform.ilike(f"{desired_platform}"))\
        .offset(skip).limit(limit).all()
    formatted_items = []

    try:
        if items:
            for item in items:
                new_item = FormatedItem(
                    game_id = item.item_id, #type:ignore
                    game_title = item.item_name, #type: ignore
                    game_platforms = item.platform, #type: ignore
                    game_genre = item.genre, #type: ignore
                    game_rating = item.rating, #type: ignore
                    game_category = item.categories, #type: ignore
                    game_release_date = item.release_date, #type: ignore
                    game_description = item.description, #type: ignore
                    game_cover = item.cover #type: ignore
                )
                formatted_items.append(new_item) #type: ignore

            total = database.query\
                (Items.platform.ilike(f"%{desired_platform}%")).count()

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
def add_to_collection(item: FormatedAddItemCollection, 
                      token: str = Depends(GameShelfBearer())):
    
    user_id = get_user_id_from_token(token)
    
    success, message = add_item_collection(user_id, item.item_id,  #type: ignore
                       item.item_rating, item.notes, item.played) #type: ignore
    
    return {"success": success, "message": message}
