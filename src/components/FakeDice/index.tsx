import type { Dispatch, SetStateAction } from "react";
import type { DiceStyles, FakeDie } from "../../types/Dice";
import type { genDieFaces } from "../../types/genesysDice";
import GenesysFakeDieDisplay from "../GenesysFakeDieDisplay";
import StandardFakeDieDisplay from "../StandardFakeDieDisplay";

interface FakeDiceProps {
  key: string;
  die: FakeDie;
  index: number;
  diceStyle: DiceStyles;
  removeDie: (die: FakeDie) => void;
  sess: [roomId: string, userId: string];
  inputResult: (values: genDieFaces[]) => void;
  setRolled: Dispatch<SetStateAction<boolean>>;
}

export default function FakeDice({
  die,
  diceStyle,
  index,
  key,
  removeDie,
  sess,
  inputResult,
  setRolled,
}: FakeDiceProps) {
  return diceStyle === "standard" ? (
    <StandardFakeDieDisplay die={die} removeDie={removeDie} sess={sess} />
  ) : diceStyle === "genesys" ? (
    <GenesysFakeDieDisplay
      die={die}
      removeDie={removeDie}
      inputResult={inputResult}
      setGenRolled={setRolled}
    />
  ) : null;
}
