// frontend/src/App.tsx
import { useRef, useState, useEffect } from "react";
import CreateGame from "./components/CreateGame";
import GameProgress from "./components/GameProgress";
import axios from "axios";
import "./styles/main.sass";

type GameStatus = "NO_GAME" | "IN_PROGRESS" | "FINISHED";

function App() {
  const [gameStatus, setGameStatus] = useState<GameStatus>("NO_GAME");
  const gameId = useRef<string>("");

  // Estados trasladados desde CreateGame
  const [playerName, setPlayerName] = useState<string>("");
  const [playerAvatar, setPlayerAvatar] = useState<"she" | "he" | "they">(
    "she"
  );
  const [gameDifficulty, setGameDifficulty] = useState<string>("n");
  const [obfuscation, setObfuscation] = useState<boolean>(false);

  // useEffect para revisar el estado persistido en localStorage
  useEffect(() => {
    const activeGame = localStorage.getItem("isActiveGame");
    const activeGameId = localStorage.getItem("activeGameId");
    if (activeGame === "true" && activeGameId) {
      gameId.current = activeGameId;

      // Recuperamos también la configuración de la partida activa:
      const storedSetup = localStorage.getItem("activeGameSetup");
      if (storedSetup) {
        try {
          const setup = JSON.parse(storedSetup);
          // setup debería tener la estructura:
          // { playerAvatar: string, gameDifficulty: string, obfuscation: boolean }
          setPlayerAvatar(setup.playerAvatar);
          setGameDifficulty(setup.gameDifficulty);
          setObfuscation(setup.obfuscation);
        } catch (err) {
          console.error("Error al parsear activeGameSetup:", err);
        }
      }

      axios
        .get(`http://127.0.0.1:8000/games/${activeGameId}`)
        .then((res) => {
          setGameStatus("IN_PROGRESS");
          console.log("Partida recuperada:", res.data);
        })
        .catch((err) => {
          console.error("Error recuperando la partida activa", err);
          localStorage.removeItem("isActiveGame");
          localStorage.removeItem("activeGameId");
          localStorage.removeItem("activeGameSetup");
          setGameStatus("NO_GAME");
        });
    }
  }, []);

  return (
    <>
      {gameStatus === "NO_GAME" && (
        <CreateGame
          onGameCreated={(newId) => {
            gameId.current = newId;
            setGameStatus("IN_PROGRESS");
          }}
          playerName={playerName}
          setPlayerName={setPlayerName}
          playerAvatar={playerAvatar}
          setPlayerAvatar={setPlayerAvatar}
          gameDifficulty={gameDifficulty}
          setGameDifficulty={setGameDifficulty}
          obfuscation={obfuscation}
          setObfuscation={setObfuscation}
        />
      )}
      {(gameStatus === "IN_PROGRESS" || gameStatus === "FINISHED") && (
        <GameProgress
          gameId={gameId.current}
          onGameFinished={() => {
            setGameStatus("FINISHED");
            // Al terminar la partida, se limpia el estado persistido
            localStorage.removeItem("isActiveGame");
            localStorage.removeItem("activeGameId");
          }}
          startNewGame={() => setGameStatus("NO_GAME")}
          gameStatus={gameStatus}
          playerName={playerName}
          playerAvatar={playerAvatar}
          gameDifficulty={gameDifficulty}
          obfuscation={obfuscation}
        />
      )}
    </>
  );
}

export default App;
