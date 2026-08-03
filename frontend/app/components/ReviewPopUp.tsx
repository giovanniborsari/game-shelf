import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export interface ReviewProps {
    game_id : number
    game_title : string
    game_rating : number|null
    game_cover: string|null
    game_platform: string|null
    release: string|null
    date: string
    played: boolean
    user_rating: number|null
    game_notes: string|null
    username: string
    onClose: () => void
}

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

export default function ReviewPopUp ( {game_id , game_title, username,
  game_rating, game_cover, release, played, user_rating, game_platform,
  game_notes, date, onClose} : ReviewProps){

const [showDeleteConfirmCol, setShowDeleteConfirmCol] = useState(false);
const [showEditCol, setShowEditCol] = useState(false);
const [game, setGame] = useState<GameDetails | null>(null);
const [editPlatform, setEditPlatform] = useState("");
const [editPlayed, setEditPlayed] = useState(false)
const [userNotes, setUserNotes] = useState(game_notes ?? "")
const [userRating, setUserRating] = useState(user_rating ?? 50)

useEffect(() => {
    fetch(`http://localhost:8000/items/get_id/${game_id}`)
    .then(res => res.json())
    .then(data => {
        console.log(data);
        setGame(data);
    });
}, [game_id])

const platforms = game?.game_platforms.split(",").map(p => p.trim());;
const togglePlatform = (name: string) => {
  setEditPlatform((prev) => {
    const current = prev ? prev.split(", ") : [];

    if (current.includes(name)) {
      const updated = current.filter((p) => p !== name);
      return updated.join(", ");
    }

    return prev ? `${prev}, ${name}` : name;
  });
};

if (typeof document === "undefined") return null;

const ratingColor = !user_rating 
    ? "bg-white" 
    : user_rating  && user_rating  >= 80 
    ? "bg-green-500" 
    : user_rating  && user_rating  >= 60 
    ? "bg-yellow-500" 
    : "bg-red-500";

const ratingColorWishlist = !game_rating 
    ? "bg-white" 
    : game_rating  && game_rating >= 80 
    ? "bg-green-500" 
    : game_rating  && game_rating  >= 60 
    ? "bg-yellow-500" 
    : "bg-red-500";

return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center 
    z-50">
    
    {user_rating!= null &&(
    <div className='flex flex-col bg-gray-500 border-2 border-emerald-400
    w-250 max-w-250 rounded-xl'>
    <Link href={`/gamepage/${game_id}`}> 
    <h1 className='flex text-3xl text-white font-bold overflow-hidden ml-auto 
    mr-auto mt-3 max-w-225 justify-center hover:text-emerald-400'> 
        {game_title} </h1>
    </Link>
    <div className='flex flex-row items-start'> 
    <img 
    src={game_cover||"/default_img.jpg"}
    className='m-5 w-50 border-2 border-black rounded-xl shrink-0'></img>
    <div className='flex flex-col flex-1 min-w-0 mr-5'>
    <div className=' flex flex-row'>
    <div className=' flex flex-col'>
    <div className=' flex flex-row'>
    <p className='text-xl text-gray-700 font-bold mt-5'> User: </p>
    <p className='text-xl text-white font-bold ml-2 max-w-100 mt-5
    overflow-hidden'
    > {username} </p>
    </div>
    <div className=' flex flex-row'>
    <p className='text-xl text-gray-700 font-bold'> Platform: </p>
    <p className='text-xl text-white font-bold ml-2 max-w-150 overflow-hidden'
    > {game_platform ?? "Unknown"} </p>
    </div>
    <div className=' flex flex-row'>
    <p className='text-xl text-gray-700 font-bold'> Release Date: </p>
    <p className='text-xl text-white font-bold ml-2 max-w-100 overflow-hidden'
    > {(release)?.slice(0,10) ?? "Unknown"} </p>
    </div>
    <div className=' flex flex-row'>
    <p className='text-xl text-gray-700 font-bold'> Played: </p>
    <p className='text-xl text-white font-bold ml-2 max-w-100 overflow-hidden'
    > {(played).toString().toUpperCase()} </p>
    </div>
    <div className=' flex flex-row'>
    <p className='text-xl text-gray-700 font-bold'> Game Rating: </p>
    <p className='text-xl text-white font-bold ml-2 max-w-100 overflow-hidden'
    > {game_rating} </p>
    </div>
    <div className=' flex flex-row'>
    <p className='text-xl text-gray-700 font-bold'> Log Date: </p>
    <p className='text-xl text-white font-bold ml-2 max-w-100 overflow-hidden'
    > {(date)?.slice(0,10) ?? "Unknown"} </p>
    </div>
    </div>
    <div className='ml-auto mt-5 mr-5 items-center flex flex-col'>
    <p className='text-xl text-gray-700 font-bold '> User's Rating </p>
    <p className=
    {`font-extrabold ${ratingColor} w-30 h-30 rounded-md text-black
    text-2xl flex items-center justify-center overflow-hidden border-2
    border-black`}>
    {user_rating ?? "X"}
    </p>
    </div>
    </div>
    <p className='text-xl text-gray-700 font-bold'> Review: </p>
    <textarea 
    value = {game_notes ?? ""}
    readOnly
    maxLength={750}
    className='text-xl text-white font-bold overflow-scrollbar resize-none
    scrollbar-thumb-emerald-400 h-50 w-full '
    > 
    </textarea>
    </div>
    </div>
    <div className='flex flex-row items-center justify-center'>
    <button onClick={onClose}
    className='border-2 border-emerald-400 m-1 p-2 font-bold bg-mauve-700
    rounded-xl'>
        Close</button>
    <button onClick={(e)=>(setShowEditCol(true))}
    className='border-2 border-emerald-400 m-1 p-2 font-bold bg-mauve-700
    rounded-xl'>
        Edit</button>
    <button onClick={(e)=>(setShowDeleteConfirmCol(true))}
    className='border-2 border-emerald-400 m-1 p-2 font-bold bg-red-600
    rounded-xl'>
        Delete</button>
    </div>
    </div>
    )}

    {showDeleteConfirmCol &&(
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center 
    z-60">
    <div className='flex flex-col bg-gray-500 border-2 rounded-xl p-2 z-60
    border-emerald-400 w-200 items-center '>
    <p className='text-xl text-white font-bold ml-auto mr-auto'>
        Do you want to remove "{game_title}" from the list ?</p>
    <div className='flex flex-row gap-2'>
    <button onClick={(e)=>{
    const token = localStorage.getItem("token") ?? "";
                        
        fetch(`http://localhost:8000/collection/me/delete/${game_id}`,{
            method: 'DELETE',
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
    }})
        .then(data =>{
        console.log(data);
        setShowDeleteConfirmCol(false);
        onClose();
        window.location.reload();
        })
        .catch(err => console.error("Error:", err));
    }}
    className='bg-red-700 text-white font-bold text-xl p-2 border-2 
    border-white rounded-xl w-20 mt-2'>YES</button>
    <button onClick={(e)=>(setShowDeleteConfirmCol(false))}
    className='bg-green-700 text-white font-bold text-xl p-2 border-2 
    border-white rounded-xl w-20 mt-2'>NO</button>
    </div>
    </div>
    </div>
    )}

    {showEditCol &&(
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center 
    z-60">
    <div className='flex flex-col bg-gray-500 border-2 rounded-xl p-2 z-60
    border-emerald-400 w-250 max-w-250'>
    <p className='text-xl text-white font-bold ml-auto mr-auto'>
        Edit {game_title}</p>
    <div className='flex flex-row items-start'> 
    <img 
    src={game_cover||"/default_img.jpg"}
    className='m-5 w-50 border-2 border-black rounded-xl shrink-0'></img>
    <div className='flex flex-col flex-1 min-w-0 mr-5'>
    <div className=' flex flex-col'>
    <div className=' flex flex-row'>
    <p className='text-xl text-gray-700 font-bold mt-5'> User: </p>
    <p className='text-xl text-white font-bold ml-2 max-w-100 mt-5
    overflow-hidden'
    > {username} </p>
    </div>
    <div className=' flex flex-col flex-1 min-w-0 mr-5 justify-center'>
    <p className='text-xl text-gray-700 font-bold'> Set Platform: </p>
    <div className="h-20 overflow-y-scroll scrollbar 
                    scrollbar-thumb-emerald-400 text-sm" dir="rtl">
    <div dir="ltr">
    {platforms && platforms.map((name) => (  
        <label key ={name} className="flex items-center
        text-sm text-white cursor-pointer hover:text-emerald-400
        transition-colors">
        <input
        type="checkbox"
        checked={editPlatform?.split(", ").includes(name) ?? false}
        onChange={() => togglePlatform(name)}
        className="accent-emerald-400 cursor-pointer"
        />
        {name}
        </label>
    ))}
    </div>
    </div>
    </div>
    <div className=' flex flex-row'>
    <input 
        type="checkbox"
        id="played-checkbox"
        checked={editPlayed}
        onChange={(e)=>setEditPlayed(e.target.checked)}
        className="accent-emerald-400 cursor-pointer">
    </input>
    <label htmlFor="played-checkbox" 
    className="text-white ml-2 font-medium cursor-pointer"> Played</label>
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
    className="accent-emerald-400 bg-gray-500cursor-pointer"/>
    <span className="text-sm text-body absolute start-0 -bottom-4">1</span>
    <span className="text-sm text-body absolute end-0 -bottom-4">100</span>
    </div>
    <h2 className='text-gray-700 font-bold text-[18px] mt-2'>
        User's Notes: 
    </h2>
    <textarea 
        value={userNotes}
        maxLength={750}
        onChange={(e)=>setUserNotes(e.target.value)}
        className="text-md text-white font-bold overflow-scrollbar resize-none
        scrollbar-thumb-emerald-400 h-50 w-auto border-black/50 border-2 p-1
        rounded-xl"
    />
    </div>
    </div>
    </div>
    <div className='flex flex-row gap-2 justify-center'>
    <button onClick={(e)=>{
    const token = localStorage.getItem("token") ?? "";
                        
        fetch(`http://localhost:8000/collection/edit`,{
            method: 'POST',
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
            body: JSON.stringify({
            item_id: game_id,
            platform: editPlatform,
            user_rating: userRating,
            notes: userNotes,
            played: editPlayed,
            })
        })
        .then(data =>{
        console.log(data);
        setShowEditCol(false);
        onClose();
        window.location.reload();
        })
        .catch(err => console.error("Error:", err));
    }}
    className='bg-green-700 text-white font-bold text-md p-2 border-2 
    border-white rounded-xl w-20 mt-2'>Update</button>
    <button onClick={(e)=>(setShowEditCol(false))}
    className='bg-red-700 text-white font-bold text-md p-2 border-2 
    border-white rounded-xl w-20 mt-2'>Cancel</button>
    </div>
    </div>
    </div>
    )}

    {/* Wishlist pop up */}
    {user_rating == null &&(
    <div className='flex flex-col bg-gray-500 border-2 border-emerald-400
    w-250 max-w-250 rounded-xl'>
    <Link href={`/gamepage/${game_id}`}> 
    <h1 className='flex text-3xl text-white font-bold overflow-hidden ml-auto 
    mr-auto mt-3 max-w-225 justify-center hover:text-emerald-400'> 
        {game_title} </h1>
    </Link>
    <div className='flex flex-row items-start'> 
    <img 
    src={game_cover||"/default_img.jpg"}
    className='m-5 w-50 border-2 border-black rounded-xl shrink-0'></img>
    <div className='flex flex-col flex-1 min-w-0 mr-5'>
    <div className=' flex flex-row'>
    <div className=' flex flex-col'>
    <div className=' flex flex-row'>
    <p className='text-xl text-gray-700 font-bold mt-5'> User: </p>
    <p className='text-xl text-white font-bold ml-2 max-w-100 mt-5
    overflow-hidden'
    > {username} </p>
    </div>
    <div className=' flex flex-row'>
    <p className='text-xl text-gray-700 font-bold'> Platform: </p>
    <p className='text-xl text-white font-bold ml-2 max-w-150 overflow-hidden'
    > {game_platform ?? "Unknown"} </p>
    </div>
    <div className=' flex flex-row'>
    <p className='text-xl text-gray-700 font-bold'> Release Date: </p>
    <p className='text-xl text-white font-bold ml-2 max-w-100 overflow-hidden'
    > {(release)?.slice(0,10) ?? "Unknown"} </p>
    </div>
    <div className=' flex flex-row'>
    <p className='text-xl text-gray-700 font-bold'> Log Date: </p>
    <p className='text-xl text-white font-bold ml-2 max-w-100 overflow-hidden'
    > {(date)?.slice(0,10) ?? "Unknown"} </p>
    </div>
    </div>
    <div className='ml-auto mt-5 mr-5 items-center flex flex-col'>
    <p className='text-xl text-gray-700 font-bold '> Game Rating </p>
    <p className=
    {`font-extrabold ${ratingColorWishlist} w-30 h-30 rounded-md text-black
    text-2xl flex items-center justify-center overflow-hidden border-2
    border-black`}>
    {game_rating ?? "X"}
    </p>
    </div>
    </div>
    </div>
    </div>
    <div className='flex flex-row items-center justify-center'>
    <button onClick={onClose}
    className='border-2 border-emerald-400 m-1 p-2 font-bold bg-mauve-700
    rounded-xl'>
        Close</button>
    <button onClick={(e)=>(setShowEditCol(true))}
    className='border-2 border-emerald-400 m-1 p-2 font-bold bg-mauve-700
    rounded-xl'>
        Edit</button>
    <button onClick={(e)=>(setShowDeleteConfirmCol(true))}
    className='border-2 border-emerald-400 m-1 p-2 font-bold bg-red-600
    rounded-xl'>
        Delete</button>
    </div>
    </div>
    )}
    </div>,
    document.body
);
}