import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Gameboard from "./GameProgress/Gameboard";
import InputTiles from "./GameProgress/InputTiles";
import Keyboard from "./GameProgress/Keyboard";
import Rules from "./GameProgress/Rules/Rules";
import { KeyInput, AttemptData, ClueData } from "./types";
import sheSpy from "./../assets/she.png";
import heSpy from "./../assets/he.png";
import theySpy from "./../assets/they.png";

const messages = [
  "Your psychic vision shattered the enemy's codes—our victory in this war is complete.",
  "With your psychic insight, you've unraveled their secret transmissions; the balance of war tilts toward us.",
  "Your mind broke through the encryption—our forces surge forward with unstoppable momentum.",
  "Another cipher falls to your telepathic skills; the war effort advances by leaps.",
  "You've cracked the last cipher. Nothing stays hidden now.",
  "The final code lies open, yet the fight continues in uneasy darkness.",
  "You've decrypted the message, but the front grows perilous and our advantage wanes.",
  "Your codebreaking arrives amid chaos; hope flickers as challenges mount.",
  "You failed to decipher the message in time. We are left in the dark.",
];

type GameProgressProps = {
  gameStatus: string;
  gameId: string;
  onGameFinished: () => void;
  startNewGame: (id: string) => void;
  playerName: string;
  playerAvatar: "she" | "he" | "they";
  gameDifficulty: string;
  obfuscation: boolean;
};

const MAX_ATTEMPTS = 8;

const GameProgress: React.FC<GameProgressProps> = ({
  gameId,
  onGameFinished,
  startNewGame,
  gameStatus,
  playerName,
  playerAvatar,
  gameDifficulty,
  obfuscation,
}) => {
  const [error, setError] = useState<string>("");
  const [tileInput, setTileInput] = useState<KeyInput | null>(null);
  const [attemptData, setAttemptData] = useState<AttemptData>({
    attempts: [],
    responses: [],
    solved: false,
  });
  const [showInstructions, setShowInstructions] = useState(false);

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
    y: { present: undefined, possiblePositions: new Set([0, 1, 2, 3, 4]) },
  };
  const [clueData, setClueData] = useState<ClueData>(initialInfo);
  const [numOfAttempts, setNumOfAttempts] = useState<number>(-1);
  const [keyColors, setKeyColors] = useState<
    Record<string, "spy-says-no" | "spy-says-yes">
  >({});

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.log("attemptData changed:", attemptData);
    }
    if (attemptData.solved === true) {
      setTimeout(() => {
        onGameFinished();
      }, 1000);
    } else if (attemptData.responses.length === MAX_ATTEMPTS) {
      setNumOfAttempts((prev) => prev + 1);
      setTimeout(() => {
        onGameFinished();
      }, 1000);
    }
  }, [attemptData, onGameFinished]);

  const fetchGameState = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/games/${gameId}`);
      setAttemptData({
        attempts: response.data.attempts || [],
        responses: response.data.responses || [],
        clues: response.data.clues,
        solved: response.data.solved || false,
      });
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
      const { result, solved } = response.data;
      setAttemptData((prev) => ({
        ...prev,
        attempts: [...prev.attempts, attempt],
        responses: [...prev.responses, result],
        solved: solved || prev.solved,
      }));
      setNumOfAttempts((prev) => prev + 1);
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

  const hideErrorTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearErrorTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showError() {
    const errorEl = document.getElementById("error");
    if (errorEl) errorEl.classList.add("opaque");
  }

  function hideError() {
    const errorEl = document.getElementById("error");
    if (errorEl) errorEl.classList.remove("opaque");
  }

  function flashError() {
    // cancel any pending timers
    if (hideErrorTimeout.current) {
      clearTimeout(hideErrorTimeout.current);
    }
    if (clearErrorTimeout.current) {
      clearTimeout(clearErrorTimeout.current);
    }

    // show and then schedule hide/clear
    showError();
    hideErrorTimeout.current = setTimeout(hideError, 4000);
    clearErrorTimeout.current = setTimeout(() => setError(""), 4500);
  }

  useEffect(() => {
    if (error && error.trim() !== "") {
      flashError();
    }
    // cleanup on unmount
    return () => {
      if (hideErrorTimeout.current) clearTimeout(hideErrorTimeout.current);
      if (clearErrorTimeout.current) clearTimeout(clearErrorTimeout.current);
    };
  }, [error]);

  return (
    <>
      <header>
        <div id="game-head">
          <div id="player-name">{playerName}</div>
          <div id="avatar">
            {playerAvatar === "she" && (
              <img src={sheSpy} alt="She Spy" className="avatar-image" />
            )}
            {playerAvatar === "he" && (
              <img src={heSpy} alt="He Spy" className="avatar-image" />
            )}
            {playerAvatar === "they" && (
              <img src={theySpy} alt="They Spy" className="avatar-image" />
            )}
          </div>
          <div id="show-intructions">
            <button
              id="show-instructions"
              onClick={() => setShowInstructions((prev) => !prev)}
            >
              ?
            </button>
          </div>
        </div>
        <div id="game-info">
          <div id="show-obfuscation">
            {obfuscation ? "Obfuscated" : "Not obfuscated"}
          </div>
          <div id="show-difficulty">
            {gameDifficulty === "0"
              ? "0 clues"
              : gameDifficulty === "1"
              ? "1 clue"
              : gameDifficulty === "5n"
              ? "∞ clues"
              : "1 clue per attempt"}
          </div>
        </div>
      </header>

      {showInstructions && <Rules setShowInstructions={setShowInstructions} />}

      <div>
        <p id="error">{error}</p>
        <Gameboard
          attemptData={attemptData}
          setError={setError}
          setClueData={setClueData}
          gameId={gameId}
          keyColors={keyColors}
          clueData={clueData}
        />
      </div>
      {gameStatus === "IN_PROGRESS" && (
        <>
          <InputTiles
            keyboardInput={tileInput}
            setKeyboardInput={setTileInput}
            setError={setError}
            onComplete={handleAttemptSubmit}
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
        <div id="game-over">
          <p>{messages[numOfAttempts]}</p>
          <button onClick={() => startNewGame(gameId)}>Play again</button>
        </div>
      )}
    </>
  );
};

export default GameProgress;
