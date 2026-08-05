import TopBar from "../components/TopBar";

export default function About() {

return(
    <div className="min-h-screen bg-gray-900 flex flex-col">
        <TopBar/>
    <div className="flex flex-col items-center ">
    <h1 className="text-3xl text-emerald-400 font-bold ">About</h1>
    <div className="border-1 border-gray-200/50 
    justify-center mt-5 max-w-250 ml-auto mr-auto p-6 rounded-xl">
    <p className="text-2xl text-white font-bold text-center">
    A place to log your games, create reviews, and track your wishlist!
    </p>
    <hr className="border-emerald-400 border-0.5 w-200 mt-2" />
    <p className="text-xl mt-2 w-190 text-center">
    GameShelf gives you the opportunity to track your game collection, adding 
    reviews and discovering what other people think. Be part of it, show what 
    you love, and share your experiences!   
    </p>
    <h2 className="text-2xl text-center font-bold mt-5 ">
        Found a bug ? Have a suggestion ?</h2>
    <hr className="border-emerald-400 border-0.5 w-200 mt-2" />
    <p className="text-xl mt-2 w-190 text-center">
    I would love to hear your ideas. This website is a work in progress built by 
    a Computer Science student learning, and trying to build something useful 
    for the community. If you found a bug, have a suggestion, or a feedback, 
    please feel free to fill the form below or email: "gameshelfct@gmail.com". 
    </p>
    </div>
    </div>
    </div>        
)
}

