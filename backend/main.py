from fastapi import FastAPI, Query
from database import SessionLocal
from models import *
from pydantic import BaseModel
from datetime import datetime
import random

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

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Game Shelf is running!"} 

@app.post("/auth/register")

@app.post("/auth/login")

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