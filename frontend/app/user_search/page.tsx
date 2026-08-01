"use client";
import {ProfileCardProps} from "../components/ProfileCard";
import { useEffect, useState } from "react";
import TopBar from "../components/TopBar";
import ProfileCard from "../components/ProfileCard";

export default function User_Search() {

const [users, setUsers] = useState<ProfileCardProps[]>([]);
const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [loaded, setLoaded] = useState(false);

useEffect(() => {
  fetch(`http://localhost:8000/users/?page=${currentPage}&limit=36`)
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
}, [currentPage]);

if (!loaded) return <p className="text-white">Loading users...</p>;
if (users && users.length == 0) 
    return <p className="text-white">No users found.</p>;

let profiles = users.map((user) => <ProfileCard key={user.user_id} {...user} />);

return(
    <div className="min-h-screen bg-gray-900 flex flex-col items-center">
    <TopBar/>
    <div className="flex flex-col p-6 gap-1 border-2 border-emerald-400 w-2xl
    rounded-lg items-center justify-center">
    <h2 className="text-2xl font-bold text-emerald-400 mb-4">Users</h2>
    {profiles}
    </div>
    </div>
)
}
