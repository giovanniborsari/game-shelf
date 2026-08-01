import Link from 'next/link'

export interface ProfileCardProps {
user_id: number
username: string
profile_pic: string
}

export default function ProfileCard 
        ({user_id, username, profile_pic} : ProfileCardProps){

return(
    <Link href={`/user/${user_id}`} >
    <div className = 
    "w-2xl bg-transparent border-2 border-emerald-400 rounded-lg p-2 flex m-1">
        <img src={profile_pic || "/placeholder.jpg"} alt={profile_pic} 
        className="rounded-md border-black border-2 text-sm truncate 
        w-22.5 h-22.5 overflow-hidden"/>
        <div className="flex flex-col items-start ml-3">
        <h1 className ="text-xl mt-1 font-mono text-white truncate max-w-110">
            {username}</h1>
    </div>
    </div>

    </Link>
)

}