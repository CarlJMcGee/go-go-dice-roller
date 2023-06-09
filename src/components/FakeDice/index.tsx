import { Dispatch, SetStateAction } from "react";
import { DiceStyles, FakeDie } from "../../types/Dice";
import { genDieFaces } from "../../types/genesysDice";
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
    <StandardFakeDieDisplay
      die={die}
      index={index}
      key={key}
      removeDie={removeDie}
      sess={sess}
    />
  ) : diceStyle === "genesys" ? (
    <GenesysFakeDieDisplay
      die={die}
      index={index}
      key={key}
      removeDie={removeDie}
      inputResult={inputResult}
      setGenRolled={setRolled}
    />
  ) : null;
}
