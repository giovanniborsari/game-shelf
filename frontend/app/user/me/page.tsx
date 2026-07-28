"use client";
import CollectionRow from "@/app/components/CollectionRow";
import TopBar from "@/app/components/TopBar";
import WishlistRow from "@/app/components/wishlistRow";
import router from "next/router";
import { useEffect, useState } from "react";

type meDetails = {
user_id: number;
username: string;
bio: string;
created: string;
profile_pic: string;
}

export default function Me(){

const [me, setMe] = useState<meDetails | null>(null);

useEffect(() => {
    const token = localStorage.getItem("token") ?? "";
    fetch(`http://localhost:8000/user/me`,{
    headers: {
      "Authorization": `Bearer ${token }`
    }
    })
    .then(res => {
    if (res.status === 403) {
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
        <div className="flex flex-row">
        <div className="w-66 m-3 border-2 border-black">
        <img src="https://images.igdb.com/igdb/image/upload/t_cover_big/coasay.jpg"
         className="w-full h-full object-cover" 
        ></img>
        </div>
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
        </div>
        <WishlistRow/>
        <CollectionRow/>
        </div>
    </div>   
)
}