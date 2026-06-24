import Link from 'next/link'

export interface GameCardProps {
  id:number 
  game_name:string
  game_rating:number|null
  game_cover:string|null
  game_genre:string|null
  game_platform:string|null
}

export default function GameCard
    ({ id, game_name, game_rating, game_cover, game_genre, game_platform }: GameCardProps) {

      const ratingColor = !game_rating 
    ? "bg-white" 
    : game_rating && game_rating >= 80 
    ? "bg-green-500" 
    : game_rating && game_rating >= 60 
    ? "bg-yellow-500" 
    : "bg-red-500";
    
  return (
    <Link href={`/games/${id}`} >
        <div className = "w-xl bg-transparent border-2 border-emerald-400 rounded-lg p-2 flex">
            <img src={game_cover || "/placeholder.jpg"} alt={game_name} className="rounded-md border-black border-2"/>

            <div className="flex flex-col items-start ml-3">
              <h1 className = "text-xl mt-1 font-mono text-white">{game_name}</h1>
              <p className="text-sm text-gray-300 mt-auto truncate max-w-xs">{game_genre ?? " "}</p>
              <p className="text-sm text-gray-300 mt-0.5 truncate max-w-xs">{game_platform ?? " "}</p>
            </div>

            <p className={`font-extrabold ml-auto ${ratingColor} w-22 rounded-md text-black text-2xl self-stretch flex items-center justify-center overflow-hidden`}>
            {game_rating ?? "X"}
            </p>
        </div>
    </Link>
  );
  
}



