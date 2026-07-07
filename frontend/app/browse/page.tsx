"use client";
import { useState, useEffect } from "react";
import GameCard, {GameCardProps} from "../components/GameCard";
import GameGrid from "../components/GameGrid";
import FilteringCol, {FilterState} from "../components/FilteringCol";


export default function Home() {

const [games, setGames] = useState<GameCardProps[]>([]);
const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [filters, setFilters] = useState<FilterState>({
    search: '',
    platform: '',
    genre: '',
    min_rating: '', 
    max_rating: '',
})

  useEffect(() => {
    const params = new URLSearchParams({ 
        page: currentPage.toString(),
        limit: '36'
    })

    if (filters.search) params.append('search', filters.search);
    if (filters.platform) params.append('platform', filters.platform);
    if (filters.genre) params.append('genre', filters.genre);
    if (filters.min_rating) params.append('min_rating', filters.min_rating)
    if (filters.max_rating) params.append('max_rating', filters.max_rating)

    fetch(`http://localhost:8000/items/?${params.toString()}`)
      .then((response) => response.json())
      .then((data) => {
        setGames(data.items);
        setTotalPages(data.pages);
      })
      .catch((err) => console.error("Error fetching filtered games:", err));
  }, [currentPage, filters]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters); // Set the permanent filters state to the new configuration
    setCurrentPage(1);      // CRITICAL: Always jump back to page 1 for fresh searches!
  };


return (
    <div className="min-h-screen bg-gray-900">
      <h1 className="text-3xl font-bold text-emerald-400 p-6">GameShelf</h1>
      <hr className="text-gray-500"></hr>
      <br></br>
      <div className="flex flex-row w-full px-6">
        <div className="w-90 flex-shrink-0">
            <FilteringCol onFilterChange={handleFilterChange} />
        </div>
        <div className="flex-1 flex flex-col justify-center items-center">
            <GameGrid gamesArray={games}/>
        </div>
        <div className="w-90 flex-shrink-0 pointer-events-none opacity-0 
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