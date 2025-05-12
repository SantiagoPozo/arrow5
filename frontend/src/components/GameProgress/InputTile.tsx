import React, { forwardRef } from "react";
import renderIcon from "../auxiliar";

export interface InputTileProps {
  value: string;
  active: boolean;
  onFocus?: () => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
}

const InputTile = forwardRef<HTMLDivElement, InputTileProps>(
  ({ value, active, onFocus, onKeyDown }, ref) => {
    return (
      <div
        ref={ref}
        tabIndex={0}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        data-value={value}
        className={`tile input-tile ${active ? "active" : ""}`}
      >
        {renderIcon(value)}
      </div>
    );
  }
);

export default InputTile;
