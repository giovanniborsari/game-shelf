"use client";
import Link from "next/link";
import GameCardHome, { GameCardHomeProps } from "./GameCardHome";
import { useEffect, useState } from "react";

export default function CollectionRow() {

const [games, setGames] = useState<GameCardHomeProps[]>([]);
const [isLoading, setIsLoading] = useState(true)

useEffect(() => {
const token = localStorage.getItem("token") ?? "";
fetch(`http://localhost:8000/collection/me`, {
headers: { "Authorization": `Bearer ${token}` }
})
    .then((response) => response.json())
    .then((data) => {
    setGames(data.collection);
    setIsLoading(false);
    })
    .catch((err) => console.error("Error fetching wishlist games:", err));
}, []);

if (isLoading) {
    return <p className="text-white p-6">Loading collection games...</p>;
}

if (games && games.length > 0) {
let gameCardRow = games.map((game) => 
                                <GameCardHome key={game.game_id} {...game} />);

    return(
        <div className="w-full px-4 py-6">
            <h2 className="text-2xl text-gray-300 font-bold md-2">
                Collection Games:
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
}