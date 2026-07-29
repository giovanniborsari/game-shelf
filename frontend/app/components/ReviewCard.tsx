import Link from 'next/link'

export interface GameReviewsProps {
    game_id: number
    user_id:number
    user: string
    user_rating: number
    platform: string|null
    date: string
    played: boolean
    notes: string|null
}

export default function GameReviewCard
    ({ game_id, user_id, user, user_rating, platform, date, played, notes }
        : GameReviewsProps) {

const ratingColor = !user_rating 
    ? "bg-white" 
    : user_rating && user_rating >= 80 
    ? "bg-green-500" 
    : user_rating && user_rating >= 60 
    ? "bg-yellow-500" 
    : "bg-red-500";

return (
        <div className='flex flex-col bg-gray-500 border-2 border-gray-300 
        p-2 mb-2 rounded-xl max-h-55'>
            <div className='flex flex-row'>
            <Link href="">
            <h2 className='text-white text-md font-bold ml-2 
            hover:text-emerald-400 transition-colors'>
                {user}
            </h2>
            </Link>
            <h2 className='ml-auto mr-2 '>{(date).slice(0,10)}</h2>
            </div>
            <div className='flex flex-row'>
            <div className='flex flex-col'>
            {notes && platform &&(
            <><h1 className='text-white text-md font-bold ml-2'>Review:</h1>
            <p className='m-2 text-white text-md font-normal max-w-full 
            break-all'>{notes}</p>
            <p className='ml-2 text-white text-md font-normal'>{platform}</p>
            </>
            )}
            </div>
            <div className='flex flex-col'>
            {!notes && platform &&(
            <>
            <p className='ml-2 text-white text-md font-normal'>{platform}</p>
            </>
            )}
            </div>
            <p className=
            {`font-extrabold ml-auto ${ratingColor} w-15 h-15 rounded-md 
            text-xl self-stretch flex items-center justify-center ml-auto mr-2
            overflow-hidden text-black shrink-0`}>
            {user_rating ?? "X"}
            </p>
            </div>
        </div>
        
  );
  
}