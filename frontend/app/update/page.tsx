"use client";
import { useState } from "react";
import TopBar from "../components/TopBar";
import { useRouter } from "next/navigation";
import { API_URL } from "../utils/api";
import BottomBar from "../components/BottomBar";
import { getToken, saveToken } from "../utils/auth";

export default function UpdateProfile(){

const router = useRouter();
const [error, setError] = useState("");
const [username, setUsername] = useState("");
const [bio, setBio] = useState("");
const [picture, setPicture] = useState("");
const [pictureFile, setPictureFile] = useState<File | null>(null);

return(
    <div className="min-h-screen bg-gray-900 flex flex-col items-center"> 
    <TopBar/>
    <div className="border-2 border-emerald-400 flex flex-col mt-10 p-3 
    items-center">
    <h1 className= "text-white text-3xl font-bold p-2 "> 
        Welcome to GameShelf!</h1>
    <h2 className= "text-white text-xl font-semibold p-2 "> 
        Update your profile</h2>
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

    {picture && (
    <img src={picture} alt="Preview" 
    className="w-24 h-24 rounded-xl object-cover mb-2" />
    )}

    <label className="bg-white text-gray-900 font-bold py-2 px-4 
    rounded cursor-pointer hover:bg-emerald-500 transition-colors min-w-xl 
    flex items-center justify-center">
    Choose Profile Picture
    <input
    type="file"
    accept="image/*"
    className="hidden"
    onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) {
    setPictureFile(file);
    setPicture(URL.createObjectURL(file));
    }
    }}
    ></input>
    </label>
    <br></br>
    <button 
    onClick={() => {
    {error && <p className="text-red-500 mt-2">{error}</p>}

    const token = getToken()?? "";
    fetch(`${API_URL}/update`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token }`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username:username,
        bio:bio,
        picture:picture
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            if (pictureFile) {
            const token = getToken() ?? "";
            const formData = new FormData();
            formData.append("file", pictureFile);

            fetch(`${API_URL}/upload/profile-picture`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData
            })
            .then(() => router.push("/user/me"))
            .catch(() => router.push("/user/me"));
            } else {
            router.push("/user/me");
            }
        } else {
            setError(data.message || "Update failed");
        }
    })
    }}
    className="flex-1 bg-emerald-400 
    hover:bg-emerald-500 text-gray-900 font-bold py-2 px-4 rounded 
    transition-colors min-w-xl min-h-10">
    Update
    </button>
    <button onClick={()=>{
        router.push("/user/me")
    }}
    className="flex-1 bg-red-600 mt-2
    hover:bg-red-700 text-white font-bold py-2 px-4 rounded 
    transition-colors min-w-xl min-h-10">
    Cancel</button>
    </div>
    <BottomBar/>
    </div>
)
}
