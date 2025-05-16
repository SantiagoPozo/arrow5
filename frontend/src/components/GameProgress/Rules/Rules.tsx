import React from "react";
import openEye from "../../../assets/open-eye.png";
import closeEye from "../../../assets/close-eye.png";
import clueRequest from "../../../assets/clue.gif";
import code from "../../../assets/code.png";
import "./Rules.sass";

interface RulesProps {
  setShowInstructions: React.Dispatch<React.SetStateAction<boolean>>;
}

const Rules: React.FC<RulesProps> = ({ setShowInstructions }) => (
  <section id="rules">
    <h2>Mission Brief</h2>
    <button
      id="close-instructions"
      onClick={() => setShowInstructions(false)}
      aria-label="Close instructions"
    >
      ×
    </button>
    <p>You are an allied spy. Your objective: decode the Axis code.</p>

    <ul id="game-rules">
      <li>
        Enter a code and receive the <span className="green">signal</span>.
        <img src={code} alt="Code screen" />
        <p>
          <span className="green">🠈 ◎ 🠈</span> means that there are three
          symbols in this attempt that are part of the <em>Secret Code</em>. The
          second one is steady (<span className="green">◎</span>), the other two
          present symbols are to the left (<span className="green">🠈</span>).
        </p>
      </li>
      <li>
        Repeat it. You have 8 attempts to crack the code and change the
        destination of the world.
      </li>

      <li>
        Request clues (if you can).
        <p>Click any digit to get a single clue.</p>
        <img src={clueRequest} alt="Request clue screen" />
      </li>

      <li>
        You can always use{" "}
        <img src={closeEye} alt="Closed Eye" className="inline" />. But
        <img src={closeEye} alt="Closed Eye" className="inline" /> can not be in
        the code in not-obfuscated games.
      </li>
    </ul>
    <p>
      <strong>Obfuscated mode</strong>:
    </p>
    <ul id="obfuscated">
      <li>
        <img src={openEye} alt="Open Eye" className="inline" /> always appears
        as{" "}
        <span className="green">
          <em>steady</em> ◎
        </span>{" "}
        in the signal.
      </li>
      <li>
        <img src={closeEye} className="inline" alt="Close Eye" /> always appears
        as{" "}
        <span className="red">
          {" "}
          <em>absent</em> ×{" "}
        </span>
        , until the code is fully decoded.
      </li>
      <li>Clues still can detect them.</li>
    </ul>
  </section>
);

export default Rules;
