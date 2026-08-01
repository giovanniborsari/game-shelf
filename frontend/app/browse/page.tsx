"use client";
import { useState, useEffect } from "react";
import GameCard, {GameCardProps} from "../components/GameCard";
import FilteringCol, {FilterState} from "../components/FilteringCol";
import TopBar from "../components/TopBar";
import { useSearchParams } from "next/navigation";

export default function Browse() {

const searchParams = useSearchParams()
const platformFromURL = searchParams.get("platform");
const genreFromURL = searchParams.get("genre");
const minFromURL = searchParams.get("min");
const maxFromURL = searchParams.get("max");
const [loaded, setLoaded] = useState(false);

const [games, setGames] = useState<GameCardProps[]>([]);
const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [filters, setFilters] = useState<FilterState>({
    search: '',
    platform: platformFromURL ? [platformFromURL] : [],
    genre:  genreFromURL ? [genreFromURL] : [],
    min_rating: minFromURL || '', 
    max_rating: maxFromURL || '',
})

  useEffect(() => {
    const params = new URLSearchParams({ 
        page: currentPage.toString(),
        limit: '36'
    })

    if (filters.search) params.append('search', filters.search);
    if (filters.platform.length > 0) params.append('platform', filters.platform.join(','));
    if (filters.genre.length > 0) params.append('genre', filters.genre.join(','));
    if (filters.min_rating) params.append('min_rating', filters.min_rating)
    if (filters.max_rating) params.append('max_rating', filters.max_rating)

    fetch(`http://localhost:8000/items/?${params.toString()}`)
      .then((response) => response.json())
      .then((data) => {
        setGames(data.items);
        setTotalPages(data.pages);
        setLoaded(true);
      })
      .catch((err) => console.error("Error fetching filtered games:", err));
      setLoaded(true);
  }, [currentPage, filters]);

 

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters); 
    setCurrentPage(1);      
  };

let gameCardGrid = games.map((game) => <GameCard key={game.game_id} {...game}/>);

if (!loaded) return <p className="text-white">Loading games...</p>;
if (!games || games.length == 0) {
        return (
        <div className="min-h-screen bg-gray-900">
            <TopBar/>
            <div className="flex flex-row w-full px-6">
              <div className="w-90 shrink-0">
                <FilteringCol onFilterChange={handleFilterChange} />
              </div>
            <p className="text-white">No games found.</p>
            </div>
            </div>
        )
    }


return (
    <div className="min-h-screen bg-gray-900">
      <TopBar/>
      <div className="flex flex-row w-full px-6">
        <div className="w-90 shrink-0">
            <FilteringCol onFilterChange={handleFilterChange} />
        </div>
        <div className="flex-1 flex flex-col justify-center items-center">
        <div className= "justify-center flex flex-col items-center gap-1 p-6 \
        border-2 border-emerald-400 w-2xl rounded-lg">
        <h2 className="text-2xl font-bold text-emerald-400 mb-4">Users</h2>
          {gameCardGrid}
        </div>
        </div>
        <div className="w-90 shrink-0 pointer-events-none opacity-0 
        hidden xl:block" aria-hidden="true"></div>
        </div>

    <div className="flex gap-4 justify-center mt-4">
      <button onClick={() => setCurrentPage(currentPage - 1)} 
              disabled={currentPage <= 1}>
        Previous
      </button>
      <span>{currentPage} of {totalPages}</span>
      <button onClick={() => setCurrentPage(currentPage + 1)} 
              disabled={currentPage >= totalPages}>
        Next
      </button>
    </div>

    </div>
  );
}