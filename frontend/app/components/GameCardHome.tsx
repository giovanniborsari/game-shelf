"use client";
import { useRouter } from "next/navigation";
import ReviewPopUp from './ReviewPopUp'
import { useState } from 'react'

export interface GameCardHomeProps {
  game_id:number 
  game_title:string
  game_rating:number|null
  game_cover:string|null
  game_platform:string|null
  release:string|null
  played: boolean
  user_rating: number|null
  game_notes: string|null
  clickable? : boolean
  username: string|null
  date: string
}

export default function GameCardHome(
    { game_id, game_title, game_rating, game_cover, game_platform, release, 
      played, game_notes, user_rating, username, date, clickable = false}
      : GameCardHomeProps) {

const router = useRouter();
const [showPopup, setShowPopup] = useState(false);

const handleClick = () => {
  if (clickable) {
    setShowPopup(true);
  } else {
    router.push(`/gamepage/${game_id}`);
  }
};

return(
  <>
    <button onClick={handleClick}>
    <div className='relative'>
    <div className='w-60 h-80 border-3 shrink-0 flex flex-col items-center gap-2 
  border-gray-600 rounded-b hover:border-emerald-400 transition-colors
    group overflow-hidden'>
        <img src={game_cover || "/placeholder.jpg"} alt={game_title} 
        className="rounded-md border-black border-2 text-sm truncate 
        max-w-66 max-h-88 bg-black mt-auto mb-auto"/>
        <span className='group-hover/edit: text-emerald-500 font-bold text-xl 
        bottom-0 truncate w-full text-center p-3 bg-gray-500 absolute
        opacity-0 group-hover:opacity-100 transition-opacity duration-150'>
        {game_title}</span>
  </div>
  </div>
  </button>
  {showPopup && username &&(
    <ReviewPopUp
    game_id={game_id}
    game_title={game_title}
    game_rating={game_rating}
    game_cover={game_cover}
    game_platform={game_platform}
    release={release}
    played={played}
    user_rating={user_rating}
    game_notes={game_notes}
    username={username}
    date={date}
    onClose={() => setShowPopup(false)}/>
  )}
  </>
)}