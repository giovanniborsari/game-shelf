"use client";
import { useEffect, useState } from "react";

export default function TopBar() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  return (
    <header className="flex flex-row h-24 items-center w-full bg-gray-900 ">
      <a href="/home" className="text-3xl font-bold text-gray-300 p-6 
      hover:text-emerald-400">
        GameShelf</a>
      
      <nav className="flex flex-row ml-auto mr-4 space-x-2">
        <a href="/browse" className="text-xl font-bold text-gray-300 p-4
      hover:text-emerald-400">
          Games
        </a>
        <a href="/user_search" className="text-xl font-bold text-gray-300 p-4 
        hover:text-emerald-400">
          Users
        </a>
        <a href="/about" className="text-xl font-bold text-gray-300 p-4 
        hover:text-emerald-400">
          About
        </a>
        { isLoggedIn && (
        <a href={"/user/me" } 
        className="text-xl font-bold text-gray-300 p-4 
        hover:text-emerald-400">
          MyProfile
        </a>
        )}
        {!isLoggedIn && (
        <a href={"/login" } 
        className="text-xl font-bold text-gray-300 p-4 
        hover:text-emerald-400">
          Login
        </a>
        )}
      </nav>
    </header>
  );
}