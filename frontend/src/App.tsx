// frontend/src/App.tsx
import { useRef, useState } from "react";
import CreateGame from "./components/CreateGame";
import GameProgress from "./components/GameProgress";
import "./styles/main.sass";

type GameStatus = "NO_GAME" | "IN_PROGRESS" | "FINISHED";

function App() {
  const [gameStatus, setGameStatus] = useState<GameStatus>("NO_GAME");
  let gameId = useRef<string>("");

  return (
    <>
      {gameStatus === "NO_GAME" && (
        <CreateGame
          onGameCreated={(newId) => {
            gameId.current = newId;
            setGameStatus("IN_PROGRESS");
          }}
        />
      )}
      {(gameStatus === "IN_PROGRESS" || gameStatus === "FINISHED") && (
        <GameProgress
          gameId={gameId.current}
          onGameFinished={() => setGameStatus("FINISHED")}
          startNewGame={() => setGameStatus("NO_GAME")}
          gameStatus={gameStatus}
        />
      )}
    </>
  );
}

export default App;
