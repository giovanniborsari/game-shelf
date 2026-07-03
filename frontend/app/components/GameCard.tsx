import Link from 'next/link'

export interface GameCardProps {
  game_id:number 
  game_title:string
  game_rating:number|null
  game_cover:string|null
  game_genre:string|null
  game_platforms:string|null
}

export default function GameCard
    ({ game_id, game_title, game_rating, game_cover, game_genre, game_platforms }: GameCardProps) {

      const ratingColor = !game_rating 
    ? "bg-white" 
    : game_rating && game_rating >= 80 
    ? "bg-green-500" 
    : game_rating && game_rating >= 60 
    ? "bg-yellow-500" 
    : "bg-red-500";
    
  return (
    <Link href={`/games/${game_id}`} >
        <div className = "w-xl bg-transparent border-2 border-emerald-400 rounded-lg p-2 flex">
            <img src={game_cover || "/placeholder.jpg"} alt={game_title} className="rounded-md border-black border-2 text-sm truncate max-w-22.5"/>

            <div className="flex flex-col items-start ml-3">
              <h1 className = "text-xl mt-1 font-mono text-white truncate max-w-xs">{game_title}</h1>
              <p className="text-sm text-gray-300 mt-auto truncate max-w-xs">{game_genre ?? " "}</p>
              <p className="text-sm text-gray-300 mt-0.5 truncate max-w-xs">{game_platforms ?? " "}</p>
            </div>

            <p className={`font-extrabold ml-auto ${ratingColor} w-22 rounded-md text-black text-2xl self-stretch flex items-center justify-center overflow-hidden`}>
            {game_rating ?? "X"}
            </p>
        </div>
    </Link>
  );
  
}



