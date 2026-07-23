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
    <Link href={`/gamepage/${game_id}`} >
    <div className='relative'>
    <div className='w-60 h-80 border-3 shrink-0 flex flex-col items-center gap-2 
  border-gray-600 rounded-b hover:border-emerald-400 transition-colors
    group overflow-hidden'>
        <img src={game_cover || "/placeholder.jpg"} alt={game_title} 
        className="rounded-md border-black border-2 text-sm truncate 
        max-w-66 max-h-88 bg-black mt-auto mb-auto"/>
        <a className='group-hover/edit: text-emerald-500 font-bold text-xl 
        bottom-0 truncate w-full text-center p-3 bg-gray-500 absolute
        opacity-0 group-hover:opacity-100 transition-opacity duration-150'>
        {game_title}</a>
  </div>
  </div>
  </Link>
)}