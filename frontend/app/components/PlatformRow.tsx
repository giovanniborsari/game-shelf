"use client";
import Link from "next/link";
import GameCardHome, { GameCardHomeProps } from "./GameCardHome";
import { useEffect, useState } from "react";
import { API_URL } from "../utils/api";

export interface PlatformRowProps {
  id: number;
  name: string;
}


export default function PlatformRow({id ,name} : PlatformRowProps) {

const [games, setGames] = useState<GameCardHomeProps[]>([]);
const [isLoading, setIsLoading] = useState(true)

useEffect(() => {
const params = new URLSearchParams({})

params.append('platform', id.toString());
params.append('min_rating', '80')

fetch(`${API_URL}/items/bigcover/?${params.toString()}`)
    .then((response) => response.json())
    .then((data) => {
    setGames(((data.items).sort(()=> Math.random()-0.5)).slice(0,30));
    setIsLoading(false);
    })
    .catch((err) => console.error("Error fetching featured games:", err));
}, [id,name]);

if (isLoading) {
    return <p className="text-white p-6">Loading {name} games...</p>;
}

if (games.length === 0) {
    return null; 
}

let gameCardRow = games.map((game) => 
                                <GameCardHome key={game.game_id} {...game} />);

    return(
        <div className="w-full px-4 py-6">
            <h2 className="text-2xl text-gray-300 font-bold md-2">
                {name} Games:
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