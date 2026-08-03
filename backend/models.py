from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Boolean,Text
from datetime import datetime, timezone
from database import Base 
import textwrap

class User(Base):
    """ 
    Models the user account table in Game Shelf Application

    Attributes:
        user_id: Unique numeric identifier for each user, auto generated
        username: User's unique chosen display name
        email: User's unique email address
        password_tokem: Hashed version of the user's password
        user_bio: Optional short description/text in the user's profile 
        profile_picture: URL pointing to the user's profile picture
        created_at: Timestamp of when the account was created
        password_attempts: Number of wrong password attempts
        last_attempts: Date of the last attempt
    """

    __tablename__ = 'users'
    user_id = Column(Integer, primary_key=True)
    username = Column(String(25), unique = True, nullable = False)
    email = Column(String(100), unique = True, nullable = False)
    password_token = Column(String, nullable = False)
    user_bio = Column(String(300), nullable = True)
    profile_picture = Column(String, nullable = True, )
    created_at_utc = Column(DateTime, nullable = False, 
                            default= lambda: datetime.now(timezone.utc).replace(tzinfo=None))
    password_attempts= Column(Integer, nullable=True, default=0)
    last_attempt= Column(DateTime, nullable=True)

class Items(Base):
    """ 
    Models the items table in Game Shelf Application

    Attributes:
        item_id: Unique numeric identifier for each item, auto generated
        igdb_id: Unique numeric identifier for each item, igdb database
        item_name: Item's unique name
        platform: Item's platform (Example: PC) 
        genre: Item's genres (Example: Puzzle)
        small_cover = URLs pointing to item's cover (low quality)
        big_cover = URLs pointing to item's cover (low quality)
        rating = Users' average rating
        release_date = date item was released
        art_url = higher quality image
    """

    __tablename__ = "items"
    item_id = Column(Integer, primary_key= True)
    igdb_id = Column(Integer, nullable=False)
    item_name = Column(String(255), unique= True, nullable= False)
    platform = Column(Text, nullable= False)
    genre = Column(Text, nullable = True)    #Sports, Fighting, RPG, etc.
    small_cover = Column(String, nullable= True)
    big_cover = Column(String, nullable= True)
    rating = Column(Float, nullable= True, default= None)
    release_date = Column(DateTime, nullable= True, default = None)
    description = Column(String, nullable= True)
    art = Column(String, nullable= True)
    age_rating = Column(Integer, nullable=True)
    age_category = Column(Integer, nullable=True)


class Wishlist(Base):
    """ 
    Models the user's Wishlist table in Game Shelf Application

    Attributes:
        wishlist_id: Wishlist's unique id
        user_id: User's unique id linked to users table
        item_id: Items's unique id linked to items table
        platform: Platform that the player want to play.
        platform_id: Platform id for filtering.
        bought: Boolean that changes once the user buys the item, moving the 
        item to the user's collection
        rating: Media rating to the game (0 to 100)
        date: Date the user added the item to the collection
    """
    __tablename__= "wishlist"
    wishlist_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.user_id"))
    item_id = Column(Integer, ForeignKey("items.item_id"))
    platform = Column(String, nullable=True, default=None)
    platform_id = Column(Integer, ForeignKey("platform_id.id"), nullable=True)
    bought = Column(Boolean, nullable= True, default= False)
    rating = Column(Float, nullable= True, default= None)
    date = Column(DateTime, nullable= True, default= None)

class CollectionList(Base):
    """ 
    Models the user's Collection table in Game Shelf Application

    Attributes:
        collection_id: Collection's unique id
        user_id: User's unique id linked to users table
        item_id: Items's unique id linked to items table
        platform: Platform that the player want to play.
        platform_id: Platform id for filtering.
        rating: Media rating to the game (0 to 100)
        user_rating: Users rating to the game (0 to 100)
        user_media: URL to uploaded media from the user to the item database
        notes: User's description/review of the item
        date: Date the user added the item to the collection
    """

    __tablename__= "collection"
    collection_id= Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.user_id"))
    item_id = Column(Integer, nullable= False)
    platform = Column(String, nullable=True, default=None)
    platform_id = Column(Integer, ForeignKey("platform_id.id"), nullable=True)
    rating = Column(Float, nullable= True, default= None)
    user_rating = Column(Float, nullable= True, default= None)
    notes = Column(String(750), nullable= True, default= None)
    played = Column(Boolean, nullable= True, default= False)
    date = Column(DateTime, nullable= True, 
            default= lambda: datetime.now(timezone.utc).replace(tzinfo=None))

class PriceRecord(Base):
    """ 
    Models the Price Record table in Game Shelf Application

    Attributes:
        record_id: Price's Record unique id
        item_id: Items's unique id linked to items table
        date: Date when the price was recorded, current date by default 
        lowest_price_ebay: Lowest price of the day on Ebay
        avg_price_ebay: Average price of the day on Ebay

    """
         
    __tablename__= "price_record"
    record_id = Column(Integer, primary_key= True)
    item_id = Column(Integer, ForeignKey("items.item_id"))
    date = Column(DateTime, nullable= True, 
                      default= lambda: datetime.now(timezone.utc))
    lowest_price_ebay= Column(Float, nullable= True, default = None)
    avg_price_ebay= Column(Float, nullable= True, default= None)

class Showcase(Base):
    """ 
    Models the Profile Showcase in Game Shelf Application

    Attributes:
        user_id: User's unique id linked to its account
        item_id: Items's unique id linked to items table
        position: Postion of the item in the highlighted profile area

    """
         
    __tablename__= "showcase"
    showcase_id = Column(Integer, primary_key= True)
    user_id= Column(Integer, ForeignKey("users.user_id"))
    item_id= Column(Integer, ForeignKey("items.item_id"))
    position= Column(Integer, nullable=True, default = None)

class Platform_Id(Base):
    __tablename__= "platform_id"
    id = Column(Integer, primary_key= True, unique=True)
    name= Column(String, nullable=False)

class Genre_Id(Base):
    __tablename__= "genre_id"
    id = Column(Integer, primary_key= True, unique=True)
    name= Column(String, nullable=False)

class Platform_Games(Base):
    __tablename__ = "platform_games"
    id = Column(Integer, primary_key=True)
    platform_id = Column(Integer, ForeignKey("platform_id.id"), nullable=False)
    game_id = Column(Integer, ForeignKey("items.item_id"), nullable=False)

class Genre_Games(Base):
    __tablename__ = "genre_games"
    id = Column(Integer, primary_key=True)
    genre_id = Column(Integer, ForeignKey("genre_id.id"), nullable=False)
    game_id = Column(Integer, ForeignKey("items.item_id"), nullable=False)
