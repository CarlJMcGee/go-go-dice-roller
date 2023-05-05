import { DiceStyles, FakeDie } from "../../types/Dice";
import StandardFakeDieDisplay from "../StandardFakeDieDisplay";

interface FakeDiceProps {
  key: string;
  die: FakeDie;
  index: number;
  diceStyle: DiceStyles;
  removeDie: (die: FakeDie) => void;
  sess: [roomId: string, userId: string];
}

export default function FakeDice({
  die,
  diceStyle,
  index,
  key,
  removeDie,
  sess,
}: FakeDiceProps) {
  return diceStyle === "standard" ? (
    <StandardFakeDieDisplay
      die={die}
      index={index}
      key={key}
      removeDie={removeDie}
      sess={sess}
    />
  ) : // TODO: add genesys component
  // ) : diceStyle === "genesys" ? (
  //   <GenesysFakeDieDisplay die={die} index={index} key={key} />
  null;
}
