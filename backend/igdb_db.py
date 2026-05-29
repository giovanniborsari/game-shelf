import requests
from models import Items
from dotenv import load_dotenv
from typing import List, Dict
import os
import json
from database import SessionLocal
from datetime import datetime

#Variables for pre population
limit = 500
offset = 0

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

    # Fetching the token
    access_token = _get_access_token(client_id, client_sec)

    header = {
        "Client-ID":client_id,
        "Authorization": f"Bearer {access_token}",
        "Accept": "application/json"
    }

    # The endpoint for games list
    url = "https://api.igdb.com/v4/games"

    query_body = """
    fields name, platforms.name, genres.name, total_rating, cover.url, summary, first_release_date;
    where release_dates.platform = (48);
    search "God of War";
    offset 0;
    limit 1;
    """
    response = requests.post(url, headers = header, data = query_body)

    if response.status_code == 200:
        games= response.json()

        try:
            for game in games:
                #Get game name 
                name = game.get('name')

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
                if game_cover is not None:
                    url_cover = game_cover.get('url')
                
                #Rating
                game_rating = game.get('total_rating')
                
                if game_rating is not None:
                    game_rating = round(game_rating,1)
                else:
                    game_rating = None

                #Release Date
                release_date = games.get('first_release_date')


                new_game= Items(
                    item_name = name,
                    categories = category,
                    platform = all_platforms,
                    genre = all_genres,
                    cover = url_cover,
                    rating = game_rating,
                )
                print(name)
                print(category)  
                print(all_platforms)  
                print(all_genres)  
                print(url_cover)  
                print(game_rating)  
                  



        finally:
            database.close()

              

            
_population_pre()     
