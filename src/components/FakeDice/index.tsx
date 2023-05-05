import { DiceStyles, FakeDie } from "../../types/Dice";
import StandardFakeDieDisplay from "../StandardFakeDieDisplay";

interface FakeDiceProps {
  key: string;
  die: FakeDie;
  index: number;
  diceStyle: DiceStyles;
  removeDie: (die: FakeDie) => void;
}

export default function FakeDice({
  die,
  diceStyle,
  index,
  key,
  removeDie,
}: FakeDiceProps) {
  return diceStyle === "standard" ? (
    <StandardFakeDieDisplay
      die={die}
      index={index}
      key={key}
      removeDie={removeDie}
    />
  ) : diceStyle === "genesys" ? (
    <GenesysFakeDieDisplay die={die} index={index} key={key} />
  ) : null;
}
