import React, { useEffect, useState } from "react";
import axios from "axios";
import Gameboard from "./GameProgress/Gameboard";
import InputTiles from "./GameProgress/InputTiles";
import Keyboard from "./GameProgress/Keyboard";

type GameProgressProps = {
  gameStatus: string;
  gameId: string;
  onGameFinished: () => void;
  startNewGame: (id: string) => void;
};

interface GameData {
  attempts: string[];
  responses: string[];
  clues: Record<string, Record<string, string>>;
}

const GameProgress: React.FC<GameProgressProps> = ({
  gameId,
  onGameFinished,
  startNewGame,
  gameStatus,
}) => {
  const [error, setError] = useState<string | null>(null);
  // This state will hold the keyboard input passed to InputTiles
  const [tileInput, setTileInput] = useState<string>("");
  const [gameData, setGameData] = useState<GameData>({
    attempts: [],
    responses: [],
    clues: {},
  });
  const [playerName, setPlayerName] = useState<string>("");

  // Function to fetch game state from the backend using the provided game id
  const fetchGameState = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/games/${gameId}`);
      setGameData(response.data);
      setPlayerName(response.data.player);
      if (process.env.NODE_ENV !== "production") {
        console.log("response.data", response.data);
      }
    } catch (err) {
      console.error("Error fetching game state", err);
      setError("Error fetching game state");
    }
  };

  useEffect(() => {
    fetchGameState();
  }, [gameId]);

  // Function to submit a new attempt to the backend based on the completed InputTiles
  const handleAttemptSubmit = async (attempt: string) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/games/${gameId}/attempt`,
        { attempt }
      );
      const last_response = response.data.result;

      // Update the list of attempts and responses locally
      setGameData((prev) => ({
        attempts: [...prev.attempts, attempt],
        responses: [...prev.responses, last_response],
        clues: { ...prev.clues },
      }));

      // If the response indicates the game is finished, call onGameFinished.
      if (last_response === "=====") {
        setTimeout(() => {
          onGameFinished();
        }, 1000);
      }
    } catch (err) {
      console.error("Error submitting attempt", err);
      setError("Error submitting attempt");
    }
  };

  return (
    <div>
      <h2>{playerName}</h2>
      {error && <p className="error">{error}</p>}
      <div>
        <h3>Attempts</h3>
        <Gameboard gameData={gameData} gameId={gameId} />

        {gameStatus === "IN_PROGRESS" && (
          <>
            <InputTiles
              keyboardInput={tileInput}
              setKeyboardInput={setTileInput}
              onComplete={(attempt) => {
                handleAttemptSubmit(attempt);
                // Clear tileInput when an attempt is submitted.
                setTileInput("");
              }}
            />
            <Keyboard onKeyInput={(val) => setTileInput(val)} />
          </>
        )}

        {gameStatus === "FINISHED" && (
          <div>
            <p>You win</p>
            <button onClick={() => startNewGame(gameId)}>Restart Game</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameProgress;
