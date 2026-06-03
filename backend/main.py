from fastapi import FastAPI, Query
from database import SessionLocal
from models import *
from pydantic import BaseModel
from datetime import datetime
import random

class Item(BaseModel):
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

@app.get("/items/")
def items(skip: int = 0, limit: int = 36):
    database = SessionLocal()
    items = database.query(Items).offset(skip).limit(limit).all()
    formatted_items = []
    for item in items:
        new_item = Item(
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

    database.close()

    return formatted_items
