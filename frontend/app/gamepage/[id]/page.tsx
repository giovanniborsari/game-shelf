"use client";
import { useState, useEffect } from "react";
import React from "react";
import TopBar from "@/app/components/TopBar";
import ReviewCard, { GameReviewsProps } from "@/app/components/ReviewCard";


type GameDetails = {
    game_id : number;
    game_title : string;
    game_platforms : string;
    game_genre : string;
    game_rating : string;
    game_release_date : string;
    game_description : string;
    game_art : string;
    game_cover: string;
}

export default function GameDetailPage({ params }: { params: { id: string } }) {


const id = params.id;
const [game, setGame] = useState<GameDetails | null>(null);
const [showWishlistAdd, setShowWishlistAdd] = useState(false);
const [wishlistPlatform, setWishlistPlatform] = useState("");
const [showCollectionAdd, setShowCollectionAdd] = useState(false);
const [collectionPlatform, setCollectionPlatform] = useState("");
const [userRating, setUserRating] = useState(50)
const [userNotes, setUserNotes] = useState("")
const [played, setPlayed] = useState(false)
const [gameReviews, setGameReviews] = useState<GameReviewsProps[]>([]);

useEffect(() => {
    fetch(`http://localhost:8000/items/get_id/${id}`)
    .then(res => res.json())
    .then(data => {
        console.log(data);
        setGame(data);
    });
}, [id])

useEffect(() => {
    fetch(`http://localhost:8000/game/reviews?game_id=${id}`)
    .then(res => res.json())
    .then(data => {
        console.log("Reviews:", data.reviews); 
        setGameReviews(data.reviews)
    })
    .catch(err => console.error("Error fetching reviews:", err));
}, [id]); 

if (!game) return <p>Game not found!</p>;

const platforms = game?.game_platforms.split(",");

const ratingColor = !game.game_rating 
    ? "bg-white" 
    : game.game_rating && Number(game.game_rating) >= 80 
    ? "bg-green-500" 
    : game.game_rating && Number(game.game_rating) >= 60 
    ? "bg-yellow-500" 
    : "bg-red-500";

let reviews = gameReviews.map((review) => (
    <ReviewCard key={review.user_id} {...review} />
));

return (
<>
<div className="min-h-screen bg-gray-900">
    <TopBar/>
    <div className = " relative mx-6 mt-4 rounded-lg ">
        <img 
            src={game.game_art || "placeholder_art.jpg"} 
            alt={game.game_art}
            className="w-full h-96 object-cover object-center"/>
        <img 
            src={game.game_cover || "placeholder_art.jpg"} 
            alt={game.game_cover}
            className="absolute border-black border-2 top-25 left-25 "/>
    </div>
    
    <div> 
        <h1 className="font-bold text-white text-[32px] ml-110 mt-3 ">
            {game.game_title}</h1>
        <br></br>
        <div className="flex flex-row">
            <div className="border border-emerald-400 rounded-xl w-65 mr-auto
            ml-32 p-5 flex flex-col items-center ">
            <h1 className="font-bold text-xl mb-2">
                Release Date:</h1>
            <h3 className="ml-2 font-medium text-xl mb-2 text-gray-400"> 
            {game.game_release_date ? game.game_release_date.slice(0,10): 
            "XX/XX/XXXX"}</h3>
            
            <h1 className="font-bold text-xl mb-2 mt-2 "> 
            Game Rating:</h1>
            <p className=
            {`font-extrabold ${ratingColor} rounded-md text-black
            text-2xl flex justify-center items-center w-15 h-15 
            ml-auto mr-auto`}>
            {game.game_rating ?? "X"}
            </p>

            <h1 className="font-bold text-xl mb-2 mt-2 "> 
            User Rating:</h1>
            <p className=
            {`font-extrabold ${ratingColor} rounded-md text-black
            text-2xl flex justify-center items-center w-15 h-15 
            ml-auto mr-auto`}>
            {game.game_rating ?? "X"}
            </p>

            <h1 className="font-bold text-xl mb-2 mt-2 "> 
            Add to List:</h1>
            <button onClick={() => setShowWishlistAdd(true)}
            className=
            {`font-mono ml-auto bg-emerald-400 rounded-md text-black
            text-xl flex justify-center items-center w-35 h-5 p-3 mr-auto
            border-green-800 border-2`}>
            Wishlist
            </button>
            {showWishlistAdd &&(
            <div className="fixed inset-0 flex items-center justify-center 
            bg-black/50 z-50">
                <div className="bg-gray-900 border-2 border-emerald-400
                rounded-lg w-full max-w-md p-6 flex flex-col">
                    <h1 
                    className="text-white font-bold text-2xl ml-auto mr-auto
                    mb-2">
                        Add to Wishlist
                    </h1>
                    <div className="flex flex-row gap-4">
                    <img src={game.game_cover || "placeholder_art.jpg"} 
                    alt ={game.game_cover}
                    className="w-36 border-2 border-black shrink-0 "/> 
                    <div className="flex flex-col items-center">
                    <h2 className='text-white font-bold text-[18px] 
                    overflow-hidden h-13 hover:{game.game_title' >
                        {game.game_title}
                    </h2>
                    <div className="mt-2 mb-auto">
                    <h2 className='text-white font-bold text-[18px]'>
                        Set Platform
                    </h2>
                    <div className="h-20 overflow-y-scroll scrollbar 
                    scrollbar-thumb-emerald-400 text-sm" dir="rtl">
                    <div dir="ltr">
                    {platforms && platforms.map((name) => (  
                    <label key ={name} className="flex items-center
                    test-sm text-white cursor-pointer hover:text-emerald-400
                    transition-colors">
                        <input
                            type="radio"
                            checked={wishlistPlatform === name}
                            onChange={() => setWishlistPlatform(name)}
                            className="accent-emerald-400 cursor-pointer"
                        />
                        {name}
                    </label>
                    ))}
                    </div>
                    </div>
                    </div>
                    </div>
                    </div>
                    <div className="flex flex-row gap-2 mt-1">
                    <button onClick={()=>{

                        const token = localStorage.getItem("token") ?? "";

                        fetch("http://localhost:8000/wishlist/add",{
                        method: 'POST',
                        headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                        },
                            body: JSON.stringify({
                            item_id: game.game_id,
                            platform: wishlistPlatform
                            })
                        })
                        .then(res=> res.json())
                        .then(data =>{
                            console.log(data)
                            setShowWishlistAdd(false)
                        })
                        .catch(err => console.error("Error:", err));
                        }}
                    className="flex-1 bg-emerald-400 
                    hover:bg-emerald-500 text-gray-900 font-bold py-2 px-4 
                    rounded transition-colors">
                    Add
                    </button>
                    <button onClick={()=>setShowWishlistAdd(false)}
                    className="flex-1 bg-red-400 
                    hover:bg-red-500 text-gray-900 font-bold py-2 px-4 
                    rounded transition-colors">
                    Close
                    </button>
                    </div>
                </div>
            </div>
            )}
            <button onClick={() => setShowCollectionAdd(true)}
            className=
            {`font-mono ml-auto bg-emerald-400 rounded-md text-black
            text-xl flex justify-center items-center w-35 h-5 p-3 mt-2 mr-auto
            border-green-800 border-2`}>
            Collection
            </button>
            {showCollectionAdd &&(
            <div className="fixed inset-0 flex items-center justify-center 
            bg-black/50 z-50">
                <div className="bg-gray-900 border-2 border-emerald-400
                rounded-lg w-full max-w-xl p-6 flex flex-col">
                    <h1 
                    className="text-white font-bold text-2xl ml-auto mr-auto
                    mb-2">
                        Add to Collection
                    </h1>
                    <div className="flex flex-row gap-2">
                    <img src={game.game_cover || "placeholder_art.jpg"} 
                    alt ={game.game_cover}
                    className="w-36 h-52 object-cover border-2 border-black 
                    shrink-0 mr-2"/> 
                    <div className="flex flex-col">
                    <h2 className='text-white font-bold text-[18px] 
                    overflow-hidden max-h-13'>
                        {game.game_title}
                    </h2>
                    <div className="mt-2 mb-auto">
                    <h2 className='text-white font-bold text-[18px]'>
                        Set Platform
                    </h2>
                    <div className="h-20 overflow-y-scroll scrollbar 
                    scrollbar-thumb-emerald-400 text-sm" dir="rtl">
                    <div dir="ltr">
                    {platforms && platforms.map((name) => (  
                    <label key ={name} className="flex items-center
                    test-sm text-white cursor-pointer hover:text-emerald-400
                    transition-colors">
                        <input
                            type="radio"
                            checked={collectionPlatform === name}
                            onChange={() => setCollectionPlatform(name)}
                            className="accent-emerald-400 cursor-pointer"
                        />
                        {name}
                    </label>
                    ))}
                    </div>
                    </div>
                    <h2 className='text-white font-bold text-[18px] mt-2'>
                        User's Rating: {userRating}
                    </h2>
                    <div className="relative mb-6 flex flex-col">
                    <label htmlFor="labels-range-input" className="sr-only">
                        Labels range</label>
                    <input
                            type="range"
                            name="rating"
                            min="0"
                            max="100"
                            step="1"
                            value={userRating}
                            onChange={(e) => 
                                setUserRating(Number(e.target.value))}
                            className="accent-emerald-400 bg-gray-500
                            cursor-pointer"
                        />
                    <span className="text-sm text-body absolute start-0 
                    -bottom-4">1</span>
                    <span className="text-sm text-body absolute end-0 
                    -bottom-4">100</span>
                    </div>
                    <h2 className='text-white font-bold text-[18px] mt-2'>
                        User's Notes: 
                    </h2>
                    <textarea 
                        value={userNotes}
                        maxLength={300}
                        onChange={(e)=>setUserNotes(e.target.value)}
                        className="bg-gray-500 w-full h-45 text-md font-medium
                        p-1 resize-none scrollbar-thumb-emerald-400"
                    />
                    <input 
                    type="checkbox"
                    id="played-checkbox"
                    checked={played}
                    onChange={(e)=>setPlayed(e.target.checked)}
                    className="accent-emerald-400 cursor-pointer">
                    </input>
                    <label htmlFor="played-checkbox" 
                    className="text-white m-2 cursor-pointer"> Played</label>
                    </div>
                    </div>
                    </div>
                    <div className="flex flex-row gap-2 mt-1">
                    <button onClick={()=>{

                        const token = localStorage.getItem("token") ?? "";

                        fetch("http://localhost:8000/collection/add",{
                        method: 'POST',
                        headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                        },
                            body: JSON.stringify({
                            item_id: game.game_id,
                            platform: collectionPlatform,
                            item_rating: userRating,
                            notes: userNotes,
                            played: played
                            })
                        })
                        .then(res=> res.json())
                        .then(data =>{
                            console.log(data)
                            setShowCollectionAdd(false)
                        })
                        .catch(err => console.error("Error:", err));
                        }}
                    className="flex-1 bg-emerald-400 
                    hover:bg-emerald-500 text-gray-900 font-bold py-2 px-4 
                    rounded transition-colors">
                    Add
                    </button>
                    <button onClick={()=>setShowCollectionAdd(false)}
                    className="flex-1 bg-red-400 
                    hover:bg-red-500 text-gray-900 font-bold py-2 px-4 
                    rounded transition-colors">
                    Close
                    </button>
                    </div>
                </div>
            </div>
            )}
        </div>
        <div className="flex flex-col p-5 ml-5 border rounded-xl border-emerald-400 
        w-250 mr-auto  ">
            <h2 className="font-bold text-xl mb-2"> Platforms:</h2>
            <h3 className="ml-2 font-medium mb-2 text-gray-400"> 
            {game.game_platforms}</h3>

            <h2 className="font-bold text-xl mb-2"> Genres:</h2>
            <h3 className="ml-2 font-medium mb-2 text-gray-400"> 
            {game.game_genre}</h3>

            <h2 className="font-bold text-xl mb-2"> Description:</h2>
            <h3 className="ml-2 font-medium mb-2 text-gray-400"> 
            {game.game_description}</h3>
            
            {reviews.length > 0 &&(
            <><h2 className="font-bold text-xl mb-2"> Reviews:</h2>
            <div className=" rounded-xl border-2 border-emerald-500 p-2">
            {reviews}
            </div></>
            )}
            </div>
        
        </div>
    </div>     
</div>
</>
)
}