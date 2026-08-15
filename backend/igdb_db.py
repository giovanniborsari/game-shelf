import requests
from models import Genre_Games, Genre_Id, Items, Platform_Games, Platform_Id
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
    offset = 368560

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
        fields id, name, platforms.name, genres.name, total_rating, 
        cover.image_id, first_release_date, artworks.image_id, summary, 
        age_ratings.rating, age_ratings.category;
        sort id asc;
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
            
            for game in games:
                try:
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
                            
                            #Add to platform table
                            query_plat = database.query(Platform_Id).\
                            filter(Platform_Id.name == renamed_name).first()
                            
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

                    #IGDB id
                    igdb_id = game.get('id')

                    #Check if game already exists
                    existing_game = database.query(Items).filter(Items.igdb_id
                                                             == igdb_id).first()
                    #Update item if it already exists
                    if existing_game:
                        print(f'{name} is already in the database')                   
        
                    else:
                        #creates a new item if it is not present in the database
                        new_game= Items(
                            item_name = name,
                            igdb_id = igdb_id,
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
                        database.refresh(new_game)  
                        
                        #Link with platform_items table
                        for plat_name in platform_names:
                            query_plat = database.query(Platform_Id)\
                                .filter(Platform_Id.name == plat_name).first()
                            if query_plat:
                                new_link = Platform_Games(
                                    platform_id = query_plat.id,
                                    game_id = new_game.item_id
                                )
                                database.add(new_link)
                        database.commit()

                        #Link with genre_items table
                        for gen_name in genre_names:
                            query_gen = database.query(Genre_Id)\
                                .filter(Genre_Id.name == gen_name).first()
                            if query_gen:
                                new_link = Genre_Games(
                                    genre_id = query_gen.id,
                                    game_id = new_game.item_id
                                )
                                database.add(new_link)
                        database.commit()
                        
                except Exception as e:
                    print(f"Error on game: {name}, skipping it!")
                    print(f"Error: {e}")

                    #Rollback database and coninue to the next item, so method can
                    #still looking for more items
                    database.rollback()
                    continue

            if len(games) < limit:
                break

            offset += limit
            #time.sleep(0.25)
                
    #Always close the database
    database.close()

def _platform_id_pop ():

    PLATFORMS = [
    '1292 Advanced Programmable Video System',
    '3DO Interactive Multiplayer',
    '64DD', 
    'AY-3-8500', 
    'AY-3-8603', 
    'AY-3-8605', 
    'AY-3-8606', 
    'AY-3-8607', 
    'AY-3-8610', 
    'AY-3-8760', 
    'Acorn Archimedes', 
    'Acorn Electron', 
    'Advanced Pico Beena', 
    'AirConsole', 
    'Amazon Fire TV', 
    'Amiga', 
    'Amiga CD32', 
    'Amstrad CPC', 
    'Amstrad GX4000', 
    'Amstrad PCW', 
    'Analogue electronics', 
    'Android', 
    'Apple II', 
    'Apple IIGS', 
    'Apple Pippin', 
    'Arcade', 
    'Arcadia 2001', 
    'Arduboy', 
    'Atari 2600', 
    'Atari 5200', 
    'Atari 7800', 
    'Atari 8-bit', 
    'Atari Jaguar', 
    'Atari Jaguar CD', 
    'Atari Lynx', 
    'Atari ST/STE', 
    'BBC Microcomputer System', 
    'Bally Astrocade', 
    'BlackBerry OS', 
    'Blu-ray Player', 
    'CDC Cyber 70', 
    'Call-A-Computer time-shared mainframe computer system', 
    'Casio Loopy', 
    'ColecoVision', 
    'Commodore 16', 
    'Commodore C64/128/MAX', 
    'Commodore CDTV', 
    'Commodore PET', 
    'Commodore Plus/4', 
    'Commodore VIC-20', 
    'DEC GT40', 
    'DOS', 
    'DUPLICATE Stadia', 
    'DVD Player', 
    'Daydream', 
    'Digiblast', 
    'Donner Model 30', 
    'Dragon 32/64', 
    'Dreamcast', 
    'EDSAC', 
    'Elektor TV Games Computer', 
    'Epoch Cassette Vision', 
    'Epoch Super Cassette Vision', 
    'Evercade', 
    'Exidy Sorcerer', 
    'FM Towns', 
    'FM-7', 
    'Fairchild Channel F', 
    'Family Computer', 
    'Family Computer Disk System', 
    'Gamate', 
    'Game & Watch', 
    'Game Boy', 
    'Game Boy Advance', 
    'Game Boy Color', 
    'Game.com', 
    'Gear VR', 
    'Gizmondo', 
    'Google Stadia', 
    'HP 2100', 
    'HP 3000', 
    'Handheld Electronic LCD', 
    'Hyper Neo Geo 64', 
    'HyperScan', 
    'Imlac PDS-1', 
    'Intellivision', 
    'Intellivision Amico', 
    'LaserActive', 
    'LeapTV', 
    'Leapster', 
    'Leapster Explorer/LeadPad Explorer', 
    'Legacy Computer', 
    'Legacy Mobile Device', 
    'Linux', 
    'MSX', 
    'MSX2', 
    'Mac', 
    'Mega Duck/Cougar Boy', 
    'Meta Quest 2', 
    'Meta Quest 3', 
    'Microcomputer', 
    'Microvision', 
    'N-Gage', 
    'NEC PC-6000 Series', 
    'Neo Geo AES', 
    'Neo Geo CD', 
    'Neo Geo MVS', 
    'Neo Geo Pocket', 
    'Neo Geo Pocket Color', 
    'New Nintendo 3DS', 
    'Nintendo 3DS', 
    'Nintendo 64', 
    'Nintendo DS', 
    'Nintendo DSi', 
    'Nintendo Entertainment System', 
    'Nintendo GameCube', 
    'Nintendo Switch', 
    'Nintendo Switch 2', 
    'Nuon', 
    'OOParts', 
    'Oculus Go', 
    'Oculus Quest', 
    'Oculus Rift', 
    'Oculus VR', 
    'Odyssey', 
    'Odyssey 2 / Videopac G7000', 
    'OnLive Game System', 
    'Ouya', 
    'PC (Microsoft Windows)', 
    'PC Engine SuperGrafx', 
    'PC-50X Family', 
    'PC-8800 Series', 
    'PC-9800 Series', 
    'PC-FX', 
    'PDP-1', 
    'PDP-10', 
    'PDP-11', 
    'PDP-7', 
    'PDP-8', 
    'PLATO', 
    'Palm OS', 
    'Panasonic Jungle', 
    'Panasonic M2', 
    'Philips CD-i', 
    'PlayStation 1', 
    'PlayStation 2', 
    'PlayStation 3', 
    'PlayStation 4', 
    'PlayStation 5', 
    'PlayStation Portable', 
    'PlayStation VR', 
    'PlayStation VR2', 
    'PlayStation Vita', 
    'Playdate', 
    'Playdia', 
    'Plug & Play', 
    'PocketStation', 
    'Pokémon mini', 
    'Polymega', 
    'R-Zone', 
    'SDS Sigma 7', 
    'SG-1000', 
    'Satellaview', 
    'Sega 32X', 
    'Sega CD', 
    'Sega CD 32X', 
    'Sega Game Gear', 
    'Sega Master System/Mark III', 
    'Sega Mega Drive/Genesis', 
    'Sega Pico', 
    'Sega Saturn', 
    'Sharp MZ-2200', 
    'Sharp X1', 
    'Sharp X68000', 
    'Sinclair QL', 
    'Sinclair ZX81', 
    'Sol-20', 
    'SteamVR', 
    "Super A'Can", 
    'Super Famicom', 
    'Super NES CD-ROM System', 
    'Super Nintendo Entertainment System', 
    'TRS-80', 
    'TRS-80 Color Computer', 
    'Tapwave Zodiac', 
    'Tatung Einstein', 
    "Terebikko / See 'n Say Video Phone", 
    'Texas Instruments TI-99', 
    'Thomson MO5', 
    'Tomy Tutor / Pyuta / Grandstand Tutor', 
    'TurboGrafx-16/PC Engine', 
    'Turbografx-16/PC Engine CD', 
    'Unknown', 
    'Uzebox', 
    'V.Smile', 
    'VC 4000', 
    'Vectrex', 
    'Virtual Boy', 
    'Virtual Console', 
    'Visual Memory Unit / Visual Memory System', 
    'Watara/QuickShot Supervision', 
    'Web browser', 
    'Wii', 
    'Wii U', 
    'Windows Mixed Reality', 
    'Windows Mobile', 
    'Windows Phone', 
    'WonderSwan', 
    'WonderSwan Color', 
    'Xbox Classic', 
    'Xbox 360', 
    'Xbox One', 
    'Xbox Series X|S', 
    'ZX Spectrum', 
    'Zeebo', 
    'e-Reader / Card-e Reader', 
    'iOS', 
    'visionOS'
]

    database = SessionLocal()
    
    try:
        for p in PLATFORMS:
            print(p)
            new_platform = Platform_Id(
                name= p
            )
            database.add(new_platform)
            database.commit()
    finally:
        database.close()

def _genre_id_pop ():

    GENRES = [
    'Adventure',
    'Arcade', 
    'Card & Board Game', 
    'Fighting', 
    "Hack and slash/Beat 'em up", 
    'Indie', 
    'MOBA', 
    'Music', 
    'Pinball', 
    'Platform', 
    'Point-and-click', 
    'Puzzle', 
    'Quiz/Trivia', 
    'Racing',
    'Real Time Strategy (RTS)', 
    'Role-playing (RPG)', 
    'Shooter', 
    'Simulator', 
    'Sport', 
    'Strategy', 
    'Tactical', 
    'Turn-based strategy (TBS)', 
    'Unknown', 
    'Visual Novel'
    ]

    database = SessionLocal()
    
    try:
        for g in GENRES:
            print(g)
            new_genre = Genre_Id(
                name= g
            )
            database.add(new_genre)
            database.commit()
    finally:
        database.close()
#_genre_id_pop()
#_platform_id_pop()
_population_pre()