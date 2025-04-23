import React, { useEffect, useState } from "react";
import axios from "axios";
import Gameboard from "./GameProgress/Gameboard";
import InputTiles from "./GameProgress/InputTiles";
import Keyboard from "./GameProgress/Keyboard";
import { KeyInput, AttemptData, ClueData } from "./types";
import sheSpy from "./../assets/she.png";
import heSpy from "./../assets/he.png";
import theySpy from "./../assets/they.png";

type GameProgressProps = {
  gameStatus: string;
  gameId: string;
  onGameFinished: () => void;
  startNewGame: (id: string) => void;
};

const GameProgress: React.FC<GameProgressProps> = ({
  gameId,
  onGameFinished,
  startNewGame,
  gameStatus,
}) => {
  const [error, setError] = useState<string>("");
  const [tileInput, setTileInput] = useState<KeyInput | null>(null);
  const [attemptData, setAttemptData] = useState<AttemptData>({
    attempts: [],
    responses: [],
  });
  const [playerName, setPlayerName] = useState<string>("");
  const [gender, setGender] = useState<string>("none");

  const initialInfo: ClueData = {
    "0": { present: undefined, possiblePositions: new Set([0, 1, 2, 3, 4]) },
    "1": { present: undefined, possiblePositions: new Set([0, 1, 2, 3, 4]) },
    "2": { present: undefined, possiblePositions: new Set([0, 1, 2, 3, 4]) },
    "3": { present: undefined, possiblePositions: new Set([0, 1, 2, 3, 4]) },
    "4": { present: undefined, possiblePositions: new Set([0, 1, 2, 3, 4]) },
    "5": { present: undefined, possiblePositions: new Set([0, 1, 2, 3, 4]) },
    "6": { present: undefined, possiblePositions: new Set([0, 1, 2, 3, 4]) },
    "7": { present: undefined, possiblePositions: new Set([0, 1, 2, 3, 4]) },
    "8": { present: undefined, possiblePositions: new Set([0, 1, 2, 3, 4]) },
    "9": { present: undefined, possiblePositions: new Set([0, 1, 2, 3, 4]) },
    x: { present: undefined, possiblePositions: new Set([0, 1, 2, 3, 4]) },
    y: { present: false, possiblePositions: new Set<number>() },
  };
  const [clueData, setClueData] = useState<ClueData>(initialInfo);

  // Estado para los colores asignados a los caracteres del teclado
  const [keyColors, setKeyColors] = useState<
    Record<string, "spy-says-no" | "spy-says-yes">
  >({});

  const fetchGameState = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/games/${gameId}`);
      // Se actualiza solo el attemptData porque la API ya no envía player ni gender
      setAttemptData(response.data);
      // Se recupera el active player de localStorage
      const activePlayer = localStorage.getItem("activePlayer") || "";
      setPlayerName(activePlayer);
      // Si se deseara recuperar el avatar asociado, se podría obtener desde localStorage "players"
      const playersStr = localStorage.getItem("players");
      if (playersStr) {
        const players = JSON.parse(playersStr);
        const found = players.find((p: any) => p.name === activePlayer);
        setGender(found ? found.avatar : "none");
      }
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

  const handleAttemptSubmit = async (attempt: string) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/games/${gameId}/attempt`,
        { attempt }
      );
      const last_response = response.data.result;
      setAttemptData((prev) => ({
        attempts: [...prev.attempts, attempt],
        responses: [...prev.responses, last_response],
      }));
      if (last_response === "=====") {
        setTimeout(() => {
          onGameFinished();
        }, 1000);
      }
      return true;
    } catch (err) {
      console.error("Error submitting attempt", err);
      if (
        axios.isAxiosError(err) &&
        err.response &&
        err.response.data?.detail
      ) {
        setError(err.response.data.detail);
      } else {
        setError("Error submitting attempt");
      }
      return false;
    }
  };

  return (
    <>
      <header>
        <div id="player-name">{playerName}</div>
        <div id="avatar">
          {gender === "she" && (
            <img src={sheSpy} alt="She Spy" className="avatar-image" />
          )}
          {gender === "he" && (
            <img src={heSpy} alt="He Spy" className="avatar-image" />
          )}
          {gender === "they" && (
            <img src={theySpy} alt="They Spy" className="avatar-image" />
          )}
        </div>
      </header>
      {error && <p className="error">{error}</p>}
      <Gameboard
        attemptData={attemptData}
        setError={setError}
        setClueData={setClueData}
        gameId={gameId}
        keyColors={keyColors}
        clueData={clueData}
      />
      {gameStatus === "IN_PROGRESS" && (
        <>
          <InputTiles
            keyboardInput={tileInput}
            setKeyboardInput={setTileInput}
            setError={setError}
            onComplete={async (attempt) => {
              const success = await handleAttemptSubmit(attempt);
              return success;
            }}
          />
          <Keyboard
            clueData={clueData}
            onKeyInput={(val) => setTileInput(val)}
            keyColors={keyColors}
            setKeyColors={setKeyColors}
          />
        </>
      )}
      {gameStatus === "FINISHED" && (
        <div>
          <p>You win</p>
          <button onClick={() => startNewGame(gameId)}>Restart Game</button>
        </div>
      )}
    </>
  );
};

export default GameProgress;
