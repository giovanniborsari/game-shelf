import React, { useState, useMemo } from 'react';

export type FilterState ={
    search: string;
}

type UserSearchColProps = {
    onFilterChange: (filters: FilterState) => void;
};

export default function UserSearchCol({ onFilterChange }: UserSearchColProps){

const[search, setSearch] = useState("");

const handleApply = (e: React.SubmitEvent) => {

    e.preventDefault();

    onFilterChange({
    search
})

};

const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    setSearch('');
    onFilterChange({ search: "" });
};

return(

    <form onSubmit={handleApply} className=" flex flex-col w-72
     border-emerald-300 border-2 rounded ml-10 items-center"> 
    <h2 className='text-2xl font-bold mt-0.5 '>Filters</h2>
    <label className="text-sm text-gray-200"> Search User 
    </label>
    <input type="text" 
        value={search}
        onChange={(e) => setSearch(e.target.value)} 
        className='rounded text-black bg-gray-100 m-0.5 ' 
        placeholder="Username"></input>
    <div className="flex gap-2 mt-2">
    <button type="submit" className="flex-1 bg-emerald-400 
    hover:bg-emerald-500 text-gray-900 font-bold py-2 px-4 rounded 
    transition-colors">
        Apply
    </button>
    <button type="button" onClick={handleClear} className="bg-gray-700
    hover:bg-gray-600 text-white py-2 px-4 rounded 
    transition-colors">
        Clear
    </button>
    </div>
    </form>
)
}