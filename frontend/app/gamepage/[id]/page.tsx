"use client";
import { useState, useEffect } from "react";
import React from "react";

type GameDetails = {
    game_id : number;
    game_title : string;
    game_platforms : string;
    game_genre : string;
    game_rating : string;
    game_release_date : string;
    game_description : string;
    game_art : string;
    game_cover: string;
}

export default function GameDetailPage({ params }: { params: { id: string } }) {

const id = params.id;
const [game, setGame] = useState<GameDetails | null>(null);

useEffect(() => {
    fetch(`http://localhost:8000/items/get_id/${id}`)
    .then(res => res.json())
    .then(data => {
        console.log(data);
        setGame(data);
    });
}, [id])

if (!game) return <p>Game not found!</p>;

return (
<>
<div className="min-h-screen bg-gray-900">
    <h1 className="text-3xl font-bold text-emerald-400 p-6">GameShelf</h1>
    <hr className="text-gray-500"></hr>
    <br></br>
    <div className = " relative mx-6 mt-4 rounded-lg ">
        <img 
            src={game.game_art || "placeholder_art.jpg"} 
            alt={game.game_art}
            className="w-full h-96 object-cover object-center"/>
        <img 
            src={game.game_cover || "placeholder_art.jpg"} 
            alt={game.game_cover}
            className="absolute border-black border-2 top-25 left-25 "/>
    </div>
    <div>
        <h1 className="font-bold text-white text-[32px] ml-110 mt-3 ">
            {game.game_title}</h1>
        <br></br>
        <div className="flex flex-col p-5 ml-auto border rounded-xl border-emerald-400 
        w-250 mr-100 ">
        <h2 className="font-bold text-xl mb-2"> Platforms:</h2>
        <h3 className="ml-2 font-medium text-xl mb-2 text-gray-400"> 
            {game.game_platforms}</h3>

        <h2 className="font-bold text-xl mb-2"> Genres:</h2>
        <h3 className="ml-2 font-medium text-xl mb-2 text-gray-400"> 
            {game.game_genre}</h3>

        <h2 className="font-bold text-xl mb-2"> Description:</h2>
        <h3 className="ml-2 font-medium text-xl mb-2 text-gray-400"> 
            {game.game_description}</h3>
        </div>
    </div>     
</div>
</>
)
}