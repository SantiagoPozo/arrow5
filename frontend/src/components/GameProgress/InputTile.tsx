import React, { forwardRef } from "react";

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
        className={`tile input-tile ${active ? "active" : ""}`}
      >
        {value}
      </div>
    );
  }
);

export default InputTile;
