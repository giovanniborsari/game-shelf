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
    <Link href={`/gamepage/${game_id}`} className="block w-full max-w-2xl">
        <div className = "w-full bg-transparent border-2 border-emerald-400 rounded-lg p-2 sm:p-3 flex">
            <img src={game_cover || "/placeholder.jpg"} alt={game_title} 
            className="rounded-md border-black border-2 object-cover w-16 h-16 sm:w-20 sm:h-20 shrink-0"/>

            <div className="flex flex-col flex-1 min-w-0 items-start ml-3 justify-center">
              <h1 className = "text-base sm:text-xl font-mono text-white truncate w-full">
                {game_title}</h1>
              <p className="text-xs sm:text-sm text-gray-300 mt-1 truncate w-full">
                {game_genre ?? " "}</p>
              <p className="text-xs sm:text-sm text-gray-300 mt-0.5 truncate w-full">
                {game_platforms ?? " "}</p>
            </div>

            <p className=
            {`font-extrabold ml-2 sm:ml-auto ${ratingColor} 
              w-12 sm:w-22 rounded-md text-black text-lg sm:text-2xl 
              self-stretch flex items-center justify-center shrink-0`}>
            {game_rating ?? "X"}
            </p>
        </div>
    </Link>
  );
  
}



