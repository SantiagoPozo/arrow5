import React from "react";
import Tile from "./Tile";
import ResultChar from "./ResultChar";
import { AttemptData, ClueData } from "../types";

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
              >
                {character}
              </Tile>
            ))}
          </div>
          <div key={`result-${index}`}>
            <ResultChar>{attemptData.responses[index]}</ResultChar>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Gameboard;
