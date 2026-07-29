"use client";
import Link from "next/link";
import GameCardHome, { GameCardHomeProps } from "./GameCardHome";
import { useEffect, useState } from "react";

export interface RowProps {
  user_id: number|null
  row_type: string
}

export default function ProfileRow({user_id, row_type} : RowProps) {

const [games, setGames] = useState<GameCardHomeProps[]>([]);
const [isLoading, setIsLoading] = useState(true)

useEffect(() => {
    const token = localStorage.getItem("token") ?? "";

    if (user_id == null && row_type === "collection") {
      fetch(`http://localhost:8000/collection/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => response.json())
        .then((data) => {
          setGames(data.collection);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching collection games:", err);
          setIsLoading(false);
        });
    } else if (user_id == null && row_type === "wishlist") {
      fetch(`http://localhost:8000/wishlist/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => response.json())
        .then((data) => {
          setGames(data.wishlist); 
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching wishlist games:", err);
          setIsLoading(false);
        });
    } else if (user_id != null && row_type === "wishlist") {
      fetch(`http://localhost:8000/wishlist/${user_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => response.json())
        .then((data) => {
          setGames(data.wishlist); 
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching wishlist games:", err);
          setIsLoading(false);
        }); 
    } else if (user_id != null && row_type === "collection") {
      fetch(`http://localhost:8000/collection/${user_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => response.json())
        .then((data) => {
          setGames(data.collection); 
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching collection games:", err);
          setIsLoading(false);
        }); 
    } else {
        setIsLoading(false);
    }
  }, [user_id, row_type]); 

  if (isLoading) {
    return <p className="text-white p-6">Loading {row_type} games...</p>;
  }

if (games && games.length > 0) {
let gameCardRow = games.map((game) => 
                                <GameCardHome key={game.game_id} {...game} />);

    return(
        <div className="w-full px-4 py-6">
            <h2 className="text-2xl text-gray-300 font-bold md-2">
                {(row_type).charAt(0).toUpperCase() + String(row_type).slice(1)} 
                {" Games"}:
            </h2>
            <hr></hr>
            <br></br>
            <div className="flex flex-row overflow-x-auto gap-4 pb-2 scrollbar 
            scrollbar-thumb-emerald-400">
            {gameCardRow}
            </div>
        </div>
    );
}
return null;
}