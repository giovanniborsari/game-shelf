import GameCard, { GameCardProps } from "./GameCard";

interface GameGridProps {
  gamesArray: GameCardProps[];
}

export default function GameGrid({ gamesArray }: GameGridProps) {
    
    if (!gamesArray || gamesArray.length === 0) {
        return <p className="text-white">Loading games...</p>;
    }

    let gameCardGrid = gamesArray.map((game) => <GameCard key={game.game_id} {...game} />);

    return(
        <div className= "justify-center flex flex-col items-center gap-1 p-6 border-2 border-emerald-400 w-xl">
            <h2 className="text-2xl font-bold text-emerald-400 mb-4">Games</h2>
            {gameCardGrid} 

        </div>
    )
}