import Link from 'next/link'
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

export default function ReviewPopUp ( {game_id , game_title, username,
  game_rating, game_cover, release, played, user_rating, game_platform,
  game_notes, date, onClose} : ReviewProps){

if (typeof document === "undefined") return null;

const ratingColor = !user_rating 
    ? "bg-white" 
    : user_rating  && user_rating  >= 80 
    ? "bg-green-500" 
    : user_rating  && user_rating  >= 60 
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
    maxLength={750}
    className='text-xl text-white font-bold overflow-scrollbar resize-none
    scrollbar-thumb-emerald-400 h-50 w-full '
    >{game_notes} 
    </textarea>
    </div>
    </div>
    <div className='flex flex-row items-center justify-center'>
    <button onClick={onClose}
    className='border-2 border-emerald-400 m-1 p-2 font-bold bg-mauve-700
    rounded-xl'>
        Close</button>
    <button onClick={(e)=>(console.log())}
    className='border-2 border-emerald-400 m-1 p-2 font-bold bg-mauve-700
    rounded-xl'>
        Edit</button>
    <button onClick={(e)=>(console.log())}
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