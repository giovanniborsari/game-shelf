"use client";
import { useState, useEffect } from "react";
import GameCard, {GameCardProps} from "./components/GameCard";
import GameGrid from "./components/GameGrid";


export default function Home() {

  const fakeList = [
    {id:695409, 
    game_name:" Red Dead Redemption 2",
    game_rating: 93.6, 
    game_cover:"//images.igdb.com/igdb/image/upload/t_thumb/co1q1f.jpg",
    game_genre:"Shooter, Role-playing (RPG), Adventure",
    game_platform:"Google Stadia, PlayStation 4, PC (Microsoft Windows), Xbox One"},
    {id:489943,
    game_name:" Assassin's Creed IV - Black Flag",
    game_rating: 88, 
    game_cover: "//images.igdb.com/igdb/image/upload/t_thumb/co4qfn.jpg",
    game_genre:"Shooter, Role-playing (RPG), Adventure",
    game_platform:"Google Stadia, PlayStation 4, PC (Microsoft Windows), Xbox One"},
    {id:353945,
    game_name:" God of War 2 Remake",
    game_rating:null,
    game_cover:"//images.igdb.com/igdb/image/upload/t_thumb/cobikh.jpg",
    game_genre:"Shooter, Role-playing (RPG), Adventure",
    game_platform:"Google Stadia, PlayStation 4, PC (Microsoft Windows), Xbox One"}
  ]; 

const [games, setGames] = useState<GameCardProps[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/items/?page=1")
      .then((response) => response.json())
      .then((data) => {
        setGames(data.items);
      });
  }, []);

return (
    <div className="min-h-screen bg-gray-900">
      <h1 className="text-3xl font-bold text-emerald-400 p-6">GameShelf</h1>
      <hr className="text-gray-500"></hr>
      <br></br>
      <GameGrid gamesArray={games} />
    </div>
  );
}