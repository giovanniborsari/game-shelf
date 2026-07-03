import React, { useState, useMemo } from 'react';

export type FilterState ={
    search: string;
    platform: string;
    genre: string;
    max_rating: string;
    min_rating: string;
}

type FilteringColProps = {
    onFilterChange: (filters: FilterState) => void;
};

export default function FilteringCol({ onFilterChange }: FilteringColProps){

    const[search, setSearch] = useState("");
    const[platform, setPlatform] = useState("");
    const[genre, setGenre] = useState("");
    const[min_rating, setMinRating] = useState("");
    const[max_rating, setMaxRating] = useState("");

    const handleApply = (e: React.SubmitEvent) => {
        e.preventDefault(); //Stops page form reloading

        onFilterChange({
            search,
            platform,
            genre,
            min_rating,
            max_rating
        })
    };

    return(

        <form onSubmit={handleApply} className=" flex flex-col w-72
         border-emerald-300 border-2 rounded ml-10 items-center"> 
            <h2 className='text-2xl font-bold mt-0.5 '>Filters</h2>
            <label className="text-sm text-gray-200 text-right"> Search Game 
            </label>
            <input type="text" id="game_search" className='rounded text-black
            bg-gray-100 m-0.5 '></input>
        </form>
    )
}
    
