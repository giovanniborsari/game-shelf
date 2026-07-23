"use client";
import { useEffect, useState } from "react";
import ConsoleRow from "../components/ConsoleRow";
import GenreRow from "../components/GenreRow";
import TopBar from "../components/TopBar";
import { GameCardHomeProps } from "../components/GameCardHome";
import { useSearchParams } from "next/navigation";
import { FilterState } from "../components/FilteringCol";

export default function Home() {

  const searchParams = useSearchParams()
  const platformFromURL = searchParams.get("platform");

  const [games, setGames] = useState<GameCardHomeProps[]>([]);
  const [filtersGenre, setFiltersGenre] = useState<FilterState>({
      search: '',
      platform: platformFromURL ? [platformFromURL] : [],
      genre: [],
      min_rating: '85', 
      max_rating: '', 
  })

  useEffect(() => {
    const params = new URLSearchParams({})

    if (filtersGenre.search) params.append
                    ('search', filtersGenre.search);
    if (filtersGenre.platform.length > 0) params.append
                    ('platform', filtersGenre.platform.join(','));
    if (filtersGenre.genre.length > 0) params.append
                    ('genre', filtersGenre.genre.join(','));
    if (filtersGenre.min_rating) params.append
                    ('min_rating', filtersGenre.min_rating)
    if (filtersGenre.max_rating) params.append
                    ('max_rating', filtersGenre.max_rating)

    fetch(`http://localhost:8000/items/?${params.toString()}`)
      .then((response) => response.json())
      .then((data) => {
        setGames(data.items);
      })
      .catch((err) => console.error("Error fetching featured games:", err));
  }, [filtersGenre]);

  const [featuredGenres, setFeaturedGenres] = 
        useState<{id: number, name: string}[]>([])

  useEffect(() =>{
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

  const shuffledGenres = [...GENRES].sort(()=> Math.random() - 0.5);
  const picked = shuffledGenres.slice(0,4);
  setFeaturedGenres(picked)
  }, [])
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
        <TopBar/>
        <ConsoleRow/>
        {featuredGenres.map((genre) => (
        <GenreRow id={genre.id} name={genre.name} />
        ))}
    </div>

  );
}