import GameCard, { GameCardProps } from "./GameCard";

interface GameGridProps {
  gamesArray: GameCardProps[];
}

export default function GameGrid({ gamesArray }: GameGridProps) {
    
    let gameCardGrid = gamesArray.map((game) => <GameCard key={game.game_id} {...game} />);

    return(
        <div className= "flex flex-col items-center gap-1 p-6 border-2 border-emerald-400 w-xl">
            <h2 className="text-2xl font-bold text-emerald-400 mb-4">Games</h2>
            {gameCardGrid} 

        </div>
    )
}