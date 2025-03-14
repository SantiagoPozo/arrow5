import { useState } from "react";
// import reactLogo from "./assets/react.svg";
import spyLogo from "./assets/spy.png";
import "./App.css";
import CreateGame from "./components/CreateGame";

function App() {
  const [count, setCount] = useState<number>(-1);
  return (
    <>
      <h1>Arrow 5 - A Spy Game</h1>
      <a href="{spyLogo}" target="_blank">
        <img src={spyLogo} className="logo" alt="Spy logo" />
      </a>
      <CreateGame />
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p></p>
      </div>
    </>
  );
}

export default App;
