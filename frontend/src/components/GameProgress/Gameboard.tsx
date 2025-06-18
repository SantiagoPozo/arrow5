import React from "react";
import Tile from "./Tile";
import Signal from "./Signal";
import { AttemptData, ClueData } from "../types";
import renderIcon from "../auxiliar";

interface GameboardProps {
  gameId: string;
  attemptData: AttemptData;
  setAttemptData: React.Dispatch<React.SetStateAction<AttemptData>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  setClueData: React.Dispatch<React.SetStateAction<ClueData>>;
  clueData: ClueData;
  keyColors: Record<string, "spy-says-no" | "spy-says-yes">;
}

const Gameboard: React.FC<GameboardProps> = ({
  gameId,
  attemptData,
  setAttemptData,
  setError,
  setClueData,
  clueData,
  keyColors,
}) => {
  return (
    <div id="GameBoard">
      {attemptData.attempts.map((attempt, index) => (
        <div className="attempt-signal" key={`attempt-${index}`}>
          <div className="attempt">
            {attempt.split("").map((character, innerIndex) => (
              <Tile
                key={`attempt-${index}-tile-${innerIndex}`}
                gameId={gameId}
                attemptIndex={index}
                tileIndex={innerIndex}
                setAttemptData={setAttemptData}
                setError={setError}
                setClueData={setClueData}
                clueData={clueData}
                attempt={attempt}
                attemptData={attemptData}
                keyColor={keyColors[character]}
                character={character}
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
