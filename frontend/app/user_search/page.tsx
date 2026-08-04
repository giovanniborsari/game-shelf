"use client";
import {ProfileCardProps} from "../components/ProfileCard";
import { useEffect, useState } from "react";
import TopBar from "../components/TopBar";
import ProfileCard from "../components/ProfileCard";
import UserSearchCol, { FilterState } from "../components/UserSearchCol";
import { API_URL } from "../utils/api";

export default function User_Search() {

const [users, setUsers] = useState<ProfileCardProps[]>([]);
const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [loaded, setLoaded] = useState(false);

const [filters, setFilters] = useState<FilterState>({
  search: ''
})

useEffect(() => {
    const params = new URLSearchParams({ 
        page: currentPage.toString(),
        limit: '36'
    })

if (filters.search) params.append('search', filters.search);

  fetch(`${API_URL}/users/?${params.toString()}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      setUsers(data.users);
      setTotalPages(data.pages);
      setLoaded(true);
    })
    .catch((err) => {
      console.error("Error:", err);
      setLoaded(true);
    });
}, [currentPage, filters]);

let profiles = users.map((user) => <ProfileCard key={user.user_id} {...user} />);

const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters); 
    setCurrentPage(1);      
  };

if (!loaded) return <p className="text-white">Loading users...</p>;
if (users && users.length == 0) 
    return(
    <div className="min-h-screen bg-gray-900">
    <TopBar/>
    <div className="flex flex-row w-full px-6">
      <div className="w-90 shrink-0">
        <UserSearchCol onFilterChange={handleFilterChange} />
      </div>
    <p className="text-white">No users found.</p>
    </div>
    </div>
    )

return(
  <div className="min-h-screen bg-gray-900">
      <TopBar/>
      <div className="flex flex-row w-full px-6">
        <div className="w-90 shrink-0">
            <UserSearchCol onFilterChange={handleFilterChange} />
        </div>
        <div className="flex-1 flex flex-col justify-center items-center">
        <div className= "justify-center flex flex-col items-center gap-1 p-6 \
        border-2 border-emerald-400 w-2xl rounded-lg">
        <h2 className="text-2xl font-bold text-emerald-400 mb-4">Users</h2>
          {profiles}
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
