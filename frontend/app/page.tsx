import GameCard from "./components/GameCard";

export default function Home() {

return (
    <div className="min-h-screen bg-gray-900">
      <h1 className="text-3xl font-bold text-emerald-400 p-6">GameShelf</h1>
      <hr className="text-gray-500"></hr>
      <br></br>
      <GameCard
        id={695409}
        game_name=" Red Dead Redemption 2"
        game_rating= {null} 
        game_cover={"//images.igdb.com/igdb/image/upload/t_thumb/co1q1f.jpg"}
        game_genre="Shooter, Role-playing (RPG), Adventure"
        game_platform="Google Stadia, PlayStation 4, PC (Microsoft Windows), Xbox One"
      />
    </div>
  );
}