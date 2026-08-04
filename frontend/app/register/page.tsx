"use client";
import { useState } from "react";
import TopBar from "../components/TopBar";
import { useRouter } from "next/navigation";
import { API_URL } from "../utils/api";

export default function Register(){

const router = useRouter();
const [error, setError] = useState("");
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [email, setEmail] = useState("");
const [bio, setBio] = useState("");
const [picture, setPicture] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");

return(
    <div className="min-h-screen bg-gray-900 flex flex-col items-center"> 
    <TopBar/>
    <div className="border-2 border-emerald-400 flex flex-col mt-10 p-3 
    items-center">
    <h1 className= "text-white text-3xl font-bold p-2 "> 
        Welcome to GameShelf!</h1>
    <h2 className= "text-white text-xl font-semibold p-2 "> 
        Create your account</h2>
    <br></br>
    <h1 className="text-white text-2xl font-bold mr-auto p-2">Username</h1>
    <input 
    type="text"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
    className="bg-white min-w-xl min-h-10 text-black text-xl font-semibold 
    p-2"
    placeholder="Username"
    ></input>
    <h1 className="text-white text-2xl font-bold mr-auto p-2">Email</h1>
    <input 
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="bg-white min-w-xl min-h-10 text-black text-xl font-semibold 
    p-2"
    placeholder="email@gameshelf.com"
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
    <h1 className="text-white text-2xl font-bold mr-auto p-2">
        Confirm your Password</h1>
    <input 
    type="password"
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    className="bg-white min-w-xl min-h-10 text-black text-xl font-semibold 
    p-2"
    placeholder="Password"
    ></input>
    <h1 className="text-white text-2xl font-bold mr-auto p-2">
        Add your Bio</h1>
    <textarea 
    value={bio}
    onChange={(e) => setBio(e.target.value)}
    className="bg-white min-w-xl min-h-10 text-black text-xl font-semibold 
    p-2 resize-y "
    placeholder="Bio"
    ></textarea>
    <h1 className="text-white text-2xl font-bold mr-auto p-2">
        Profile Picture</h1>
    <input
    type="file"
    className="bg-white min-w-xl min-h-10 text-black text-xl font-semibold 
    p-2 items-center flex justify-center"
    //Implement it later, when adding aws
    ></input>
    <br></br>
    <button 
    onClick={() => {
    if (password !== confirmPassword) {
    setError("Passwords do not match!");
    return;
    }
    {error && <p className="text-red-500 mt-2">{error}</p>}
    fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username:username,
        password:password,
        email:email,
        bio:bio,
        picture:""
        //Implement picture when adding aws
        })
    })
    .then(res => res.json())
    .then(data => {
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        router.push("/user/me");
      } else {
        setError(data.Error);
      }
    })
    }}
    className="flex-1 bg-emerald-400 
    hover:bg-emerald-500 text-gray-900 font-bold py-2 px-4 rounded 
    transition-colors min-w-xl min-h-10">
    Register
    </button>
    </div>
    </div>
)
}
