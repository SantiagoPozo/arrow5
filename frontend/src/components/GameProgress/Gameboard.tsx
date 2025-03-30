import React from "react";
import Tile from "./Tile";
import ResultChar from "./ResultChar";

interface GameboardProps {
  gameData: {
    attempts: string[];
    responses: any[];
  };
  gameId: string;
}

const Gameboard: React.FC<GameboardProps> = ({ gameData, gameId }) => {
  return (
    <div className="GameBoard">
      {gameData.attempts.map((at, index) => (
        <div className="attempt" key={index}>
          {at.split("").map((at, innerIndex) => (
            <Tile
              gameId={gameId}
              attemptIndex={index}
              key={innerIndex}
              tileIndex={innerIndex}
            >
              {at}
            </Tile>
          ))}
          <div>
            <ResultChar>{gameData.responses[index]}</ResultChar>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Gameboard;
