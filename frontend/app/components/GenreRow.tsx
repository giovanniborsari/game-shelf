"use client";
import Link from "next/link";

const GENRES =[
    {name: "Adventure", id: 1},
    {name: "Arcade", id: 2},
    {name: "Card & Board Game", id: 3},
    {name: "Fighting", id: 4},
    {name: "Hack and slash/Beat 'em up", id: 5},
    {name: "Indie", id: 6},
    {name: "MOBA", id: 7},
    {name: "Music", id: 8},
    {name: "Pinball", id: 9},
    {name: "Platform", id: 10},
    {name: "Point-and-click", id: 11},
    {name: "Puzzle", id: 12},
    {name: "Quiz/Trivia", id: 13},
    {name: "Racing", id: 14},
    {name: "Real Time Strategy (RTS)", id: 15},
    {name: "Role-playing (RPG)", id: 16},
    {name: "Shooter", id: 17},
    {name: "Simulator", id: 18},
    {name: "Sport", id: 19},
    {name: "Strategy", id: 20},
    {name: "Tactical", id: 21},
    {name: "Turn-based strategy (TBS)", id: 22},
    {name: "Visual Novel", id: 24}
]

type Genre = {
  id: number;
  name: string;
};

export default function ConsoleRow() {
    const getRandomGenre = () => GENRES[Math.floor(Math.random() * GENRES.length)];
    const genre = getRandomGenre()
    return(
        <div className="w-full px-4 py-6">
            <h2 className="text-2xl text-gray-300 font-bold md-2">
                {genre.name} Games:
            </h2>
            <hr></hr>
            <br></br>
            <div className="flex flex-row overflow-x-auto gap-4 pb-2 scrollbar 
            scrollbar-thumb-emerald-400">

            </div>
        </div>
    );
}