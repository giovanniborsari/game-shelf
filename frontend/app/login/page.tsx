"use client";
import { useState } from "react";
import TopBar from "../components/TopBar";
import { useRouter } from "next/navigation";
import { API_URL } from "../utils/api";

export default function Login(){
    const router = useRouter();
    const [error, setError] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return(
    <div className="min-h-screen bg-gray-900 flex flex-col items-center"> 
    <TopBar/>
    <div className="border-2 border-emerald-400 flex flex-col mt-10 p-3 
    items-center">
    <h1 className="text-white text-2xl font-bold mr-auto p-2">Username</h1>
    <input 
    type="text"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
    className="bg-white min-w-xl min-h-10 text-black text-xl font-semibold 
    p-2"
    placeholder="Username"
    ></input>
    <h1 className="text-white text-2xl font-bold mr-auto p-2">Password</h1>
    <input 
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="bg-white min-w-xl min-h-10 text-black text-xl font-semibold 
    p-2"
    placeholder="Password"
    ></input>
    <br></br>
    <button 
    onClick={() => {
    fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username:username,
        password:password
        })
    })
    .then(res => res.json())
    .then(data => {
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        router.push("user/me");
      } else {
        setError(data.Error);
      }
    })
    }}
    className="flex-1 bg-emerald-400 
    hover:bg-emerald-500 text-gray-900 font-bold py-2 px-4 rounded 
    transition-colors min-w-xl min-h-10">
    Login
    </button>
    {error && <p className="text-red-500 mt-2">{error}</p>}
    <br></br>
    <a href="/register" 
    className="flex items-center justify-center bg-emerald-400
    hover:bg-emerald-500 text-gray-900 font-bold py-2 px-4 rounded 
    transition-colors min-w-xl min-h-10">
    Register
    </a>
    </div>
    </div>

    )
}