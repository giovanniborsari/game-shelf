from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Boolean
from datetime import datetime, timezone
from database import Base 

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
    """

    __tablename__ = 'users'
    user_id = Column(Integer, primary_key=True)
    username = Column(String(25), unique = True, nullable = False)
    email = Column(String(100), unique = True, nullable = False)
    password_token = Column(String(255), nullable = False)
    user_bio = Column(String(300), nullable = True)
    profile_picture = Column(String(255), nullable = True, 
                             default = "unknown.jpg")
    created_at_utc = Column(DateTime, nullable = False, 
                            default= lambda: datetime.now(timezone.utc))

class Items(Base):
    """ 
    Models the items table in Game Shelf Application

    Attributes:
        item_id: Unique numeric identifier for each item, auto generated
        item_name: Item's unique name
        platform: Item's platform (Example: PC)
        categories: Item's kind of item (Example: Controller)
        genre: Item's genres (Example: Puzzle)
        region: Region which the item was released
        variant: Item version/edition
        media = URLs pointing to item's media
        rating = Users' average rating
    """

    __tablename__ = "items"
    item_id = Column(Integer, primary_key= True)
    item_name = Column(String(255), unique= True, nullable= False)
    platform = Column(String(50), nullable= False)
    categories = Column(String(50), nullable = False)   #Game, Console, etc.
    genre = Column(String(50), nullable = True)    #Sports, Fighting, RPG, etc.
    region = Column(String(30), nullable = True, default= "International")
    variant = Column(String(50), nullable= True, default= "Standard")
    media = Column(String(255), nullable= True, default= "default_item.jpg")
    rating = Column(Float, nullable= True, default= None)

class Wishlist(Base):
    """ 
    Models the user's Wishlist table in Game Shelf Application

    Attributes:
        user_id: User's unique id linked to users table
        item_id: Items's unique id linked to items table
        price_usd: Item's price on Ebay, default = None means it is not 
        available for purchase
        bought: Boolean that changes once the user buys the item, moving the 
        item to the user's collection
        rating: Users rating to the game (0 to 10)
    """
    __tablename__= "wishlist"
    user_id = Column(Integer, ForeignKey("users.id"))
    item_id = Column(Integer, ForeignKey("items.id"))
    price_usd = Column(Float, nullable= True, default= None)
    bought = Column(Boolean, nullable= True, default= False)
    rating = Column(Float, nullable= True, default= None)

class CollectionList(Base):
    """ 
    Models the user's Collection table in Game Shelf Application

    Attributes:
        username_id: User's unique id linked to users table
        item: Items's unique id linked to items table
        rating: Users rating to the game (0 to 10)
        user_media: URL to uploaded media from the user to the item database
        condition: Condition of the user's item
        notes: User's description/review of the item
        price_paid: How much the user spent on the item
        date: Date the user acquired the item 

    """
    __tablename__= "collection"
    user_id = Column(Integer, ForeignKey('users.id'))
    item_id = Column(Integer, ForeignKey('items.id'))
    rating = Column(Float, nullable= True, default= None)
    user_media = Column(String, nullable= True, default= None)
    condition = Column(String, nullable= True, default= None)
    notes = Column(String(300), nullable= True, default= None)
    price_paid = Column(Float, nullable= True, default= None)
    date = Column(DateTime, nullable= True, default= None)


