import React from "react";
import sheSpy from "../../assets/she.png";
import heSpy from "../../assets/he.png";
import theySpy from "../../assets/they.png";
import "../../styles/components/avatars.sass";

type AvatarProps = {
  selectedAvatar: "she" | "he" | "they";
  onSelectAvatar: (avatar: "she" | "he" | "they") => void;
};

const Avatar: React.FC<AvatarProps> = ({ selectedAvatar, onSelectAvatar }) => (
  <div id="avatars-wrapper">
    {(["she", "he", "they"] as const).map((av) => (
      <div
        key={av}
        className={`avatar ${av} ${selectedAvatar === av ? "selected" : ""}`}
        onClick={() => onSelectAvatar(av)}
      >
        <img
          src={av === "she" ? sheSpy : av === "he" ? heSpy : theySpy}
          alt={`${av} Spy avatar`}
          className="avatar"
        />
      </div>
    ))}
  </div>
);

export default Avatar;
