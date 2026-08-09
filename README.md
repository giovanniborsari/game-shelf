# Game Shelf
  GameShelf is a full-stack web application that allows users to track their video game collection, write reviews, and discover new games across all major platforms.

  Game data is retrieved from [IGDB API](https://api.igdb.com/) and managed within the application using SQLAlquemy. The data is processed and stored in a PostgreeSQL database, enabling fast and flexible access to game information. 
  
  Live demo: game-shelf-nu.vercel.app

## Features
  - __Massive Database:__ GameShelf database contains over 350,000 games, including special editions and DLC, sourced from IGDB API and stored locally.
  - __Collection List:__ Add games to your collection with a personal review, 0-100 rating, and the platform you played on.
  - __Wishlist:__ Keep track of games you want to play in the future.
  - __Filtered Search:__ Search games by name, platform, genre, and rating range with paginated results
  - __User's Dashboard:__ "My Profile" shows user's profile information, including username, profile picture, profile bio, timestamp of when the account was created, collection list, and wishlist.
  - __Account Security:__ JWT Bearer token authentication with bcrypt password hashing, protected API routes, and account lockout after repeated failed login attempts

## Architecture
  - __Backend:__ Python REST API built with FastAPI, deployed on Render. Handles authentication, game data, collections, wishlist, and image uploads.
  - __Database:__ PostgreSQL database modeled with SQLAlquemy ORM and hosted on Supabase. The database contains information about the game and (id, name, genre, platform, images, and description), users (username, email, password token, user bio, profile picture, and timestamp from when it was created). Schema migrations managed with Alembic.
  - __Frontend:__ Built with React, Next.js, React, and TypeScript. The frontend access backend
  - __Storage:__ User profile pictures stored in Supabase Storage and served via public URLs.

## Roadmap
  - Profile editor
  - Password Retriever
  - Better Support on Mobile
  - Custom Game Lists
  - More filtering options
  - More game media available on game page

## Developer
Developed by Giovanni Macri Borsari

## References
Data gathered from [IGDB API](https://api.igdb.com/).
    
