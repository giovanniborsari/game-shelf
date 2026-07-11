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

    """
    Get an access token from twitch in order to access IGDB API

    Args:
        client_id: SECRET client id linked to my twitch account in order to use 
        any API from them 
        client-sec: SECRET client secret linked to my twitch account in order to 
        use any API from them 
    """

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
    """
    Method used to get data from IGDB database and feed my own "game_shelf" 
    database, this method is not supposed to be used often since it 
    goes through all IGDB's data.
    """
    database = SessionLocal()

    #Variable
    limit = 500
    offset = 0

    # Fetching the token
    access_token = _get_access_token(client_id, client_sec)

    #Uses my account information to allow access
    header = {
        "Client-ID":client_id,
        "Authorization": f"Bearer {access_token}",
        "Accept": "application/json"
    }

    # The endpoint for games list
    url = "https://api.igdb.com/v4/games"

    #Keep searching IGDB's database while length games is higher than 0
    while True :

        #Define what the method is going to get from IGDB database
        query_body = f"""
        fields name, platforms.name, genres.name, total_rating, cover.image_id, 
                first_release_date, artworks.image_id, summary;
        offset {offset};
        limit {limit};
        """
        response = requests.post(url, headers = header, data = query_body)
        print(response.status_code)
        #Response status equals 200 == success
        if response.status_code == 200:
            games= response.json()
            #Print count of games received
            print(f"Games received: {len(games)}")
            try:
                for game in games:
                    #Get game name 
                    name = game.get('name')
                    print(f"Processing: {name}")

                    #Getting game platforms

                    #Rename PlayStation for filtering 
                    PLATFORM_MAP = {
                        "PlayStation": "PlayStation 1",
                        "Xbox": "Xbox Classic"
                    }

                    #Gets the list in 'platforms'
                    platform_data = game.get('platforms',[]) 

                    platform_names=[]
                    for p in platform_data:
                        #Check is 'p' is a dictionary and has a name key
                        if isinstance(p, dict) and p.get('name'): 

                            #Rename PlayStation = PlayStation 1
                            original_name = str(p.get("name"))
                            renamed_name = PLATFORM_MAP.get\
                                (original_name, original_name)
                            
                            #Force it to be a string and append the platform name to it 
                            platform_names.append(renamed_name)
                    #Join then together if there is a platform, unknown if not
                    if platform_names:
                        all_platforms = ", ".join(platform_names) 
                    else:
                        all_platforms = "Unknown"    

                    #Getting game genres
                    genres_data = game.get('genres',[]) #Gets the list in 'genres'
                    genre_names = []

                    for g in genres_data:
                        #Check is 'g' is a dictionary and has a name key
                        if isinstance(g,dict) and g.get('name'):
                            #Force it to be a string and append the platform name to it
                            genre_names.append(str(g.get('name')))
                    #Join then together if there is a platform, unknown if not
                    if genre_names:
                        all_genres= ", ".join(genre_names)
                    else:
                        all_genres= "Unknown"    

                    #Cover Big
                    game_cover = game.get('cover') or None
                    url_bcover = None
                    if game_cover:
                        image_id = game_cover.get('image_id')
                        if image_id:
                            url_bcover = (f"https://images.igdb.com/igdb/image"
                            f"/upload/t_cover_big/{image_id}.jpg")

                    #Cover Small
                    game_cover = game.get('cover') or None
                    url_scover = None
                    if game_cover:
                        image_id = game_cover.get('image_id')
                        if image_id:
                            url_scover = (f"https://images.igdb.com/igdb/image"
                            f"/upload/t_thumb/{image_id}.jpg")

                    #Art
                    game_art = game.get('artworks') or None
                    url_art = None
                    if game_art and len(game_art) > 0:
                        image_id = game_art[0].get('image_id')
                        if image_id:
                            url_art = (f"https://images.igdb.com/igdb/image"
                            f"/upload/t_1080p/{image_id}.jpg")
                    
                    #Rating
                    game_rating = game.get('total_rating')
                    
                    if game_rating is not None:
                        game_rating = round(game_rating,0)
                    else:
                        game_rating = None

                    #Release Date
                    date = game.get('first_release_date')
                    if date is not None:
                        try:
                            #Convert data to datetime
                            date = datetime.fromtimestamp(date)
                        except (OSError, ValueError):
                            #date is set to none if any exception is caught
                            date = None
                    else:
                        date = None

                    #Description
                    desc = game.get('summary')

                    #Check if game already exists
                    existing_game = database.query(Items).filter(Items.item_name
                                                             == name).first()
                    #Update item if it already exists
                    if existing_game:                   
                        #Append new platforms if any
                        cur_platforms = existing_game.platform.split(", ")
                        new_platforms = all_platforms.split(", ")
                        final_platforms = set(cur_platforms) | set(new_platforms)
                        existing_game.platform = ", ".join(final_platforms) #type: ignore

                        #Append new genres if any
                        cur_genres = existing_game.genre.split(", ")
                        new_genres = all_genres.split(", ")
                        final_genres = set(cur_genres) | set(new_genres)
                        existing_game.genre = ", ".join(final_genres)  # type: ignore

                        database.commit()
        
                    else:
                        #creates a new item if it is not present in the database
                        new_game= Items(
                            item_name = name,
                            platform = all_platforms,
                            genre = all_genres,
                            small_cover = url_scover,
                            big_cover = url_bcover,
                            rating = game_rating,
                            release_date = date,
                            description = desc,
                            art = url_art,
                        )

                        #Add and commit new game
                        database.add(new_game)
                        database.commit()
                #Break while if len games is smaller limit
                if len(games) < limit:
                    break
                #Updates offset
                offset += limit        
        
            except Exception as e:
                print(f"Error on game: {name}, skipping it!")
                print(f"Error: {e}")

                #Rollback database and coninue to the next item, so method can
                #still looking for more items
                database.rollback()
                continue
            finally:
                time.sleep(0.25) #Pauses for 0.25 seconds due to IGDB restrictions
                print("Round of games added")
    #Always close the database
    database.close() 

_population_pre()