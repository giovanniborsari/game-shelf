import Link from 'next/link'

export interface ProfileCardProps {
user_id: number
username: string
profile_pic: string
created: string
}

export default function ProfileCard 
        ({user_id, username, profile_pic, created} : ProfileCardProps){

return(
    <Link href={`/user/${user_id}`} >
    <div className = 
    "w-2xl bg-transparent border-2 border-emerald-400 rounded-lg p-2 flex m-1 items-start">
        <img src={profile_pic || "/placeholder.jpg"} alt={username}
        className="rounded-md border-black border-2 text-sm truncate 
        w-22.5 h-28 overflow-hidden"/>
        <div className="flex flex-row ml-3 mr-3 flex-1">
        <h1 className ="text-xl mt-1 font-mono text-white truncate max-w-110">
            {username}</h1>
        <p className ="text-md mt-auto font-mono text-white truncate ml-auto 
        max-w-110">
            {(created).slice(0,10)}</p>
    </div>
    </div>

    </Link>
)

}