"use client";
import BottomBar from "@/app/components/BottomBar";
import ProfileRow from "@/app/components/ProfileRow";
import TopBar from "@/app/components/TopBar";
import { API_URL } from "@/app/utils/api";
import { clearToken } from "@/app/utils/auth";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

type meDetails = {
user_id: number;
username: string;
bio: string;
created: string;
profile_pic: string;
}

export default function Me(){

const router = useRouter();
const [me, setMe] = useState<meDetails | null>(null);
const [showLogOut, setShowLogOut] = useState(false);

useEffect(() => {
    const token = localStorage.getItem("token") ?? "";
    fetch(`${API_URL}/user/me`,{
    headers: {
      "Authorization": `Bearer ${token }`
    }
    })
    .then(res => {
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("token");
      router.push("/login");
      return;
    }
    return res.json();
    })
    .then(data => {
        if (data) setMe(data);
    })
    .catch((err) => console.error("Error:", err));
    }, []);

if (!me) return <p className="text-white">Loading...</p>;

return(
    <div className="min-h-screen bg-gray-900 flex flex-col items-center">
        <TopBar />
        <div className="flex flex-col border-2 border-emerald-400 w-6xl 
        max-w-full">
        <div className="flex flex-row ">
        <div className="w-66 m-3 border-2 border-black">
        <img src={me.profile_pic}
         className="w-full h-full object-cover" 
        ></img>
        </div>
        <div className="flex flex-row w-full">
        <div className=" flex-1 mt-10 p-2">
        <h6 className="text-gray-500 text-sm font-semibold">
            Username:</h6>
        <h1 className="text-white text-2xl font-semibold">
            {me.username}</h1>
        <br></br>
        <h6 className="text-gray-500 text-sm font-semibold">
            Bio:</h6>
        <p className="text-white text-2xl font-semibold h-35 ">
            {me.bio}</p>
        <br></br>
        <h6 className="text-gray-500 text-sm font-semibold">
            Created at:</h6>
        <h1 className="text-white text-2xl font-semibold">
            {me.created ? me.created.slice(0,10) : "Unknown"}</h1>
        </div>
        <div className="flex flex-row gap-2 ml-auto p-3 justify-start mt-3">
        <button className="bg-red-600 w-30 h-10 border-2 border-black 
        rounded-xl ml-auto hover:bg-red-800 flex items-center justify-center 
        font-semibold"
        onClick={() => setShowLogOut(true)}> 
        Log Out</button>
        {showLogOut && (
        <div className="fixed inset-0 flex items-center justify-center 
            bg-black/50 z-50">
        <div className="w-100 h-30 bg-gray-600 border-2 border-emerald-400
        flex flex-col">
        <p className="text-white text-xl font-semibold ml-auto mr-auto mt-2"> 
            Do you want to log out ?</p>
        <div className="flex flex-row items-center gap-2 m-2 justify-center">
        <button onClick={() => {
            console.log("button clicked");
            router.push("/update");
        }}
        className="bg-emerald-400 w-35 h-10 rounded-xl hover:bg-emerald-700
        border-2 border-black"
        > Yes </button>
        <button onClick={() => setShowLogOut(false)}
        className="bg-red-600 w-35 h-10 rounded-xl hover:bg-red-700 
        border-2 border-black"
        > No </button>
        </div>
        </div>
        </div>
        )}
        <a className="bg-gray-600 w-30 h-10 border-2 border-black rounded-xl
        ml-auto hover:bg-gray-800 flex items-center justify-center 
        font-semibold"> 
        Edit</a>
        </div>
        </div>
        </div>
        <ProfileRow user_id={null} row_type={"wishlist"} 
        clickable username={me.username}/>
        <ProfileRow user_id={null} row_type={"collection"} 
        clickable username={me.username}/>
        </div>
        <BottomBar/>
    </div>   
)
}