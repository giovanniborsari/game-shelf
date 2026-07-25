"use client";
import TopBar from "@/app/components/TopBar";

export default function Me(){
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
            Giovanni</h1>
        <br></br>
        <h6 className="text-gray-500 text-sm font-semibold">
            Bio:</h6>
        <p className="text-white text-2xl font-semibold max-h-35">
            Just here for the good vibes, cool loot, and side quests. 
            I spend more time customizing my character and organizing my 
            inventory than actually doing the main objective.</p>
        <br></br>
        <h6 className="text-gray-500 text-sm font-semibold">
            Created at:</h6>
        <h1 className="text-white text-2xl font-semibold">
            07/25/2026</h1>
        </div>
        </div>

        </div>
    </div>
    
)
}