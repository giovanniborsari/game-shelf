import Link from 'next/link'

export interface GameCardHomeProps {
  game_id:number 
  game_title:string
  game_rating:number|null
  game_cover:string|null
}

export default function GameCardHome(
    { game_id, game_title, game_rating, game_cover}: GameCardHomeProps) {

return(
    <div className='w-58 l-70 border-3 shrink-0 flex flex-col items-center gap-2 
  border-gray-600 rounded-b hover:border-emerald-400 transition-colors'>
        <img src={game_cover || "/placeholder.jpg"} alt={game_title} 
        className="rounded-md border-black border-2 text-sm truncate 
        max-w-58 max-h-70 bg-black mt-auto mb-auto"/>
  </div>
)}