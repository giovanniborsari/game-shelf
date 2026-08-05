"use client";
import BottomBar from "@/app/components/BottomBar";
import ProfileRow from "@/app/components/ProfileRow";
import TopBar from "@/app/components/TopBar";
import { API_URL } from "@/app/utils/api";
import router from "next/router";
import { useEffect, useState } from "react";

type userDetails = {
user_id: number;
username: string;
bio: string;
created: string;
profile_pic: string;
}

export default function UserDetailPage({ params }: { params: { id: number } }){
    const id = params.id;
    const [user, setUser] = useState<userDetails | null>(null);

    useEffect(() => {
        fetch(`${API_URL}/user/${id}`)
        .then(res => res.json())
        .then(data => {
            if (data) setUser(data);
        })
        .catch((err) => console.error("Error:", err));
    }, []);

    if (!user) return <p className="text-white">Loading...</p>;

    return(
        <div className="min-h-screen bg-gray-900 flex flex-col items-center">
            <TopBar />
            <div className="flex flex-col border-2 border-emerald-400 w-6xl 
            max-w-full">
            <div className="flex flex-row">
            <div className="w-66 m-3 border-2 border-black">
            <img src={user.profile_pic}
             className="w-full h-full object-cover" 
            ></img>
            </div>
            <div className=" flex-1 mt-10 p-2">
            <h6 className="text-gray-500 text-sm font-semibold">
                Username:</h6>
            <h1 className="text-white text-2xl font-semibold">
                {user.username}</h1>
            <br></br>
            <h6 className="text-gray-500 text-sm font-semibold">
                Bio:</h6>
            <p className="text-white text-2xl font-semibold h-35 ">
                {user.bio}</p>
            <br></br>
            <h6 className="text-gray-500 text-sm font-semibold">
                Created at:</h6>
            <h1 className="text-white text-2xl font-semibold">
                {user.created ? user.created.slice(0,10) : "Unknown"}</h1>
            </div>
            </div>
            <ProfileRow user_id={id} row_type={"wishlist"} 
            clickable username={user.username} />
            <ProfileRow user_id={id} row_type={"collection"}
            clickable username={user.username} />
            </div>
            <BottomBar/>
        </div>   
    )
    }
