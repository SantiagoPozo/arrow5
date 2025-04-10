import React, { useEffect, useState } from "react";
import axios from "axios";
import Gameboard from "./GameProgress/Gameboard";
import InputTiles from "./GameProgress/InputTiles";
import Keyboard from "./GameProgress/Keyboard";
import { KeyInput, AttemptData, ClueData } from "./types";
import sheSpy from "./../assets/she.png";
import heSpy from "./../assets/he.png";

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

  // Estado para clues.
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

  // Estado para los colores asignados a los caracteres del teclado (actualizamos los tipos)
  const [keyColors, setKeyColors] = useState<
    Record<string, "spy-says-no" | "spy-says-yes">
  >({});

  const fetchGameState = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/games/${gameId}`);
      setAttemptData(response.data);
      setPlayerName(response.data.player);
      setGender(response.data.gender || "none");
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
      return true; // Indica éxito
    } catch (err) {
      console.error("Error submitting attempt", err);
      // Si es AxiosError y tiene el detalle enviado por el servidor, lo usamos.
      if (
        axios.isAxiosError(err) &&
        err.response &&
        err.response.data?.detail
      ) {
        setError(err.response.data.detail);
      } else {
        setError("Error submitting attempt");
      }
      return false; // Indica error
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
          {gender === "both" && (
            <>
              <img src={sheSpy} alt="She Spy" className="avatar-image" />
              <img src={heSpy} alt="He Spy" className="avatar-image" />
            </>
          )}
        </div>
      </header>
      {error && <p className="error">{error}</p>}
      <div>
        <h3>Attempts</h3>
        <Gameboard
          attemptData={attemptData}
          setError={setError}
          setClueData={setClueData} // Se pasa setClueData para que Gameboard pueda gestionar las pistas
          gameId={gameId}
          keyColors={keyColors} // Pasamos los colores al tablero
          clueData={clueData} // Passing the clueData state to Gameboard
        />
        {gameStatus === "IN_PROGRESS" && (
          <>
            <InputTiles
              keyboardInput={tileInput}
              setKeyboardInput={setTileInput}
              setError={setError}
              onComplete={async (attempt) => {
                const success = await handleAttemptSubmit(attempt);
                return success; // true si se envió correctamente, false en caso de error
              }}
            />
            <Keyboard
              clueData={clueData}
              onKeyInput={(val) => setTileInput(val)}
              keyColors={keyColors} // Pasamos los colores al teclado
              setKeyColors={setKeyColors} // Pasamos el setter
            />
          </>
        )}
        {gameStatus === "FINISHED" && (
          <div>
            <p>You win</p>
            <button onClick={() => startNewGame(gameId)}>Restart Game</button>
          </div>
        )}
      </div>
    </>
  );
};

export default GameProgress;
