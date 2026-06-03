import requests
from models import Items
from dotenv import load_dotenv
from typing import List, Dict
import os
import json
from database import SessionLocal
from datetime import datetime
import time

load_dotenv() #reads .env file and loads it to python

client_id = os.getenv("CLIENT_ID")
client_sec = os.getenv("CLIENT_SECRET")

def _get_access_token(client_id, secret_id):

    auth_url = "https://id.twitch.tv/oauth2/token"
    params = {
        "client_id":client_id,
        "client_secret": client_sec,
        "grant_type": "client_credentials"
    }
    response = requests.post(auth_url, params=params)

    if response.status_code == 200:
        token_data = response.json()
        return token_data["access_token"]
    else:
        raise Exception(f"Failed to authenticate: {response.text}")

def _population_pre ():
    database = SessionLocal()

    #Variable
    limit = 500
    offset = 0

    # Fetching the token
    access_token = _get_access_token(client_id, client_sec)

    header = {
        "Client-ID":client_id,
        "Authorization": f"Bearer {access_token}",
        "Accept": "application/json"
    }

    # The endpoint for games list
    url = "https://api.igdb.com/v4/games"

    while True :
        query_body = f"""
        fields name, platforms.name, genres.name, total_rating, cover.url, summary, first_release_date;
        offset {offset};
        limit {limit};
        """
        response = requests.post(url, headers = header, data = query_body)

        if response.status_code == 200:
            games= response.json()
            print(f"Games received: {len(games)}")
            try:
                for game in games:
                    #Get game name 
                    name = game.get('name')
                    print(f"Processing: {name}")
                    
                    #Category equals game, IGDB just have games
                    category = "Game"

                    #Getting game platforms
                    platform_data = game.get('platforms',[]) #Gets the list in 'platforms'

                    platform_names=[]
                    for p in platform_data:
                        #Check is 'p' is a dictionary and has a name key
                        if isinstance(p, dict) and p.get('name'): 
                            #Force it to be a string and append the platform name to it 
                            platform_names.append(str(p.get("name")))
                    #Join then together if there is a platform, unknown if not
                    if platform_names:
                        all_platforms = ", ".join(platform_names) 
                    else:
                        all_platforms = "Unknown"    

                    #Getting game genres
                    genres_data = game.get('genres',[]) #Gets the list in 'genres'
                    genre_names = []

                    for g in genres_data:
                        if isinstance(g,dict) and g.get('name'):
                            genre_names.append(str(g.get('name')))
                    if genre_names:
                        all_genres= ", ".join(genre_names)
                    else:
                        all_genres= "Unknown"    

                    #Cover
                    game_cover = game.get('cover') or None
                    url_cover = None
                    if game_cover is not None:
                        url_cover = game_cover.get('url')
                    
                    #Rating
                    game_rating = game.get('total_rating')
                    
                    if game_rating is not None:
                        game_rating = round(game_rating,1)
                    else:
                        game_rating = None

                    #Release Date
                    date = game.get('first_release_date')
                    if date is not None:
                        try:
                            date = datetime.fromtimestamp(date)
                        except (OSError, ValueError):
                            date = None
                        else:
                            date = None

                    #Description
                    desc = game.get('summary')

                    #Check if game already exists
                    existing_game = database.query(Items).filter(Items.item_name == name).first()

                    if existing_game:                   
                        #Append new platforms if any
                        cur_platforms = existing_game.platform.split(", ")
                        new_platforms = all_platforms.split(", ")
                        final_platforms = set(cur_platforms) | set(new_platforms)
                        final_platforms = ", ".join(final_platforms)
                        existing_game.platform = final_platforms #type: ignore

                        #Append new genres
                        cur_genres = existing_game.genre.split(", ")
                        new_genres = all_genres.split(", ")
                        final_genres = set(cur_genres) | set(new_genres)
                        existing_game.genre = ", ".join(final_genres)  # type: ignore

                        database.commit()
        
                    else:
                        new_game= Items(
                            item_name = name,
                            categories = category,
                            platform = all_platforms,
                            genre = all_genres,
                            cover = url_cover,
                            rating = game_rating,
                            release_date = date,
                            description = desc
                        
                        )
                        database.add(new_game)
                        database.commit()
                if len(games) < limit:
                    break
    
                offset += limit        
                    
            except Exception as e:
                print(f"Error on game: {name}, skipping it!")
                print(f"Error: {e}")
                database.rollback()
                continue
            finally:
                time.sleep(0.25) #Pauses for 1 seconds due to IGDB restrictions
                print("Round of games added")
                database.close() 
               
           
_population_pre()     
