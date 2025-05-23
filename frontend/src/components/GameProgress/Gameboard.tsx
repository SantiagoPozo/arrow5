import React from "react";
import Tile from "./Tile";
import Signal from "./Signal";
import { AttemptData, ClueData } from "../types";
import renderIcon from "../auxiliar";

interface GameboardProps {
  attemptData: AttemptData;
  setError: React.Dispatch<React.SetStateAction<string>>;
  setClueData: React.Dispatch<React.SetStateAction<ClueData>>;
  clueData: ClueData;
  gameId: string;
  keyColors: Record<string, "spy-says-no" | "spy-says-yes">;
}

const Gameboard: React.FC<GameboardProps> = ({
  attemptData,
  setError,
  setClueData,
  clueData,
  gameId,
  keyColors,
}) => {
  return (
    <div className="GameBoard">
      {attemptData.attempts.map((at, index) => (
        <div key={`attempt-${index}`}>
          <div className="attempt">
            {at.split("").map((character, innerIndex) => (
              <Tile
                key={`attempt-${index}-tile-${innerIndex}`}
                gameId={gameId}
                attemptIndex={index}
                tileIndex={innerIndex}
                setError={setError}
                setClueData={setClueData}
                clueData={clueData}
                attempt={at}
                keyColor={keyColors[character]}
                data-value={character}
              >
                {renderIcon(character)}
              </Tile>
            ))}
          </div>
          <div key={`signal-${index}`}>
            <Signal>{attemptData.responses[index]}</Signal>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Gameboard;
