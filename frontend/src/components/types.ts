export type ClueResult = "" | "absent" | "steady" | "left" | "right";

export interface AttemptData {
  attempts: string[];
  responses: string[];
  requestedClues: ClueResult[][];
  solved: boolean;
}

export interface KeyInput {
  type: "character" | "action";
  value?: string | React.ReactNode;
  action?: "delete" | "send" | "spySaysNo" | "spySaysYes" | "clear-color";
}

export interface ClueData {
  [key: string]: {
    present?: boolean;
    possiblePositions: number[];
  };
}

export interface InputAttemptProps {
  attempt: string;
  setAttempt: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: (attempt: string) => void;
}
