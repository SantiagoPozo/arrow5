// frontend/src/App.tsx
import { useRef, useState } from "react";
import CreateGame from "./components/CreateGame";
import GameProgress from "./components/GameProgress";
import "./styles/main.sass";

type GameStatus = "NO_GAME" | "IN_PROGRESS" | "FINISHED";

function App() {
  const [gameStatus, setGameStatus] = useState<GameStatus>("NO_GAME");
  const gameId = useRef<string>("");

  // Estados trasladados desde CreateGame
  const [playerName, setPlayerName] = useState<string>("");
  const [selectedAvatar, setSelectedAvatar] = useState<"she" | "he" | "they">(
    "she"
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("n");
  const [obfuscation, setObfuscation] = useState<boolean>(false);

  return (
    <>
      {gameStatus === "NO_GAME" && (
        <CreateGame
          onGameCreated={(newId) => {
            gameId.current = newId;
            setGameStatus("IN_PROGRESS");
          }}
          setPlayerName={setPlayerName}
          selectedAvatar={selectedAvatar}
          setSelectedAvatar={setSelectedAvatar}
          selectedDifficulty={selectedDifficulty}
          setSelectedDifficulty={setSelectedDifficulty}
          obfuscation={obfuscation}
          setObfuscation={setObfuscation}
        />
      )}
      {(gameStatus === "IN_PROGRESS" || gameStatus === "FINISHED") && (
        <GameProgress
          gameId={gameId.current}
          onGameFinished={() => setGameStatus("FINISHED")}
          startNewGame={() => setGameStatus("NO_GAME")}
          gameStatus={gameStatus}
          playerName={playerName}
          selectedAvatar={selectedAvatar}
          selectedDifficulty={selectedDifficulty}
          obfuscation={obfuscation}
        />
      )}
    </>
  );
}

export default App;
