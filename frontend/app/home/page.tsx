"use client";
import { Suspense, useEffect, useState } from "react";
import ConsoleRow from "../components/ConsoleRow";
import GenreRow from "../components/GenreRow";
import TopBar from "../components/TopBar";
import { GameCardHomeProps } from "../components/GameCardHome";
import { useSearchParams } from "next/navigation";
import { FilterState } from "../components/FilteringCol";
import PlatformRow from "../components/PlatformRow";

function Home() {

  const searchParams = useSearchParams();

  const [featuredGenres, setFeaturedGenres] = 
        useState<{id: number, name: string}[]>([])

  useEffect(() =>{
    const GENRES =[
    {name: "Adventure", id: 1},
    {name: "Card & Board Game", id: 3},
    {name: "Fighting", id: 4},
    {name: "Hack and slash/Beat 'em up", id: 5},
    {name: "Indie", id: 6},
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
]

  const shuffledGenres = [...GENRES].sort(()=> Math.random() - 0.5);
  setFeaturedGenres(shuffledGenres)
  }, [])

  const [featuredPlatforms, setFeaturedPlatforms] = 
        useState<{id: number, name: string}[]>([])

  useEffect(() =>{
    const PLATFORMS =[
    {name: "Game Boy", id: 74},
    {name: "Game Boy Advance", id: 75},
    {name: "Nintendo 3DS", id: 112},
    {name: "Nintendo 64", id: 113},
    {name: "Nintendo DS", id: 114},
    {name: "Nintendo Switch", id: 118},
    {name: "Nintendo Switch", id: 119},
    {name: "PlayStation 1", id: 146},
    {name: "PlayStation 2", id: 147},
    {name: "PlayStation 3", id: 148},
    {name: "PlayStation 4", id: 149},
    {name: "PlayStation 5", id: 150},
    {name: "PlayStation Portable", id: 151},
    {name: "Sega Mega Drive/Genesis", id: 170},
    {name: "Super Famicom", id: 181},
    {name: "Super Nintendo Entertainment System", id: 183},
    {name: "Wii", id: 204},
    {name: "Xbox Classic", id: 211},
    {name: "Xbox 360", id: 212},
    {name: "Xbox One", id: 213},
    {name: "Xbox Series X|S", id: 214},
    {name: "Dreamcast", id: 60},
    {name: "Neo Geo AES", id: 106}
]

  const shuffledPlatforms = [...PLATFORMS].sort(()=> Math.random() - 0.5);
  setFeaturedPlatforms(shuffledPlatforms)
  }, [])
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
        <TopBar/>
        <ConsoleRow/>
        {featuredGenres.length > 0 && featuredPlatforms.length > 0 && (
        <>
        <p>test</p>
        <GenreRow id={1} name="Adventure" />
        <GenreRow
        key={featuredGenres[0].id}
        id={featuredGenres[0].id}
        name={featuredGenres[0].name} />
        <GenreRow
        key={featuredGenres[1].id}
        id={featuredGenres[1].id}
        name={featuredGenres[1].name} />
        <PlatformRow
        key={featuredPlatforms[0].id}
        id={featuredPlatforms[0].id}
        name={featuredPlatforms[0].name} />
        <PlatformRow
        key={featuredPlatforms[1].id}
        id={featuredPlatforms[1].id}
        name={featuredPlatforms[1].name} />
        <PlatformRow
        key={featuredPlatforms[2].id}
        id={featuredPlatforms[2].id}
        name={featuredPlatforms[2].name} />
        <GenreRow
        key={featuredGenres[2].id}
        id={featuredGenres[2].id}
        name={featuredGenres[2].name} />
        <GenreRow
        key={featuredGenres[3].id}
        id={featuredGenres[3].id}
        name={featuredGenres[3].name} />
        </> 
        )}
    </div>

  );
}

export default function HomeLoading() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 text-white p-6">
        Loading page...
      </div>
    }>
      <Home/>
    </Suspense>
  );
}