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
}

export default async function GameDetailPage() {

return (
<div className="min-h-screen bg-gray-900">
    <h1 className="text-3xl font-bold text-emerald-400 p-6">GameShelf</h1>
    <hr className="text-gray-500"></hr>
    <br></br>
</div>
)
}