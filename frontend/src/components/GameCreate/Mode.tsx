import React from "react";
import "../../styles/components/_Mode.sass";

interface ModeProps {
  obfuscation: boolean;
  setObfuscation: (value: boolean) => void;
}

const Mode: React.FC<ModeProps> = ({ obfuscation, setObfuscation }) => {
  return (
    <div className="mode-wrapper">
      <div className="mode-toggle">
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={obfuscation}
            onChange={(e) => setObfuscation(e.target.checked)}
          />
          <span className="toggle-slider"></span>
          <div className="toggle-text">
            <span className="toggle-on">Obfuscation ON</span>
            <span className="toggle-off">Obfuscation OFF</span>
          </div>
          <div className="tooltip">
            <p className="description">
              Eye characters are obfuscated. Open eye always appears as steady
              ◎. Closed eye always appears as absent. Clues still works.
            </p>
            <p className="flavor">Nothing is as we were told.</p>
          </div>
        </label>
      </div>
    </div>
  );
};

export default Mode;
