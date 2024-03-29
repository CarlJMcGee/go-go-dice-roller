import type { DiceStyles } from "../../types/Dice";
import type { genDieFaces } from "../../types/genesysDice";
import type { Die } from "../../utils/go-dice-api";
import GenesysDieDisplay from "../GenesysDieDisplay";
import StandardDieDisplay from "../StandardDieDisplay";

interface DiceProps {
  diceStyle: DiceStyles;
  die: Die;
  index: number;
  playerId: string;
  roomId: string;
  removeDie: (dieId: string) => void;
  inputResult: (values: genDieFaces[]) => void;
  setRolled: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Dice({
  diceStyle,
  die,
  index: i,
  playerId,
  roomId,
  removeDie,
  inputResult,
  setRolled,
}: DiceProps) {
  return diceStyle === "standard" ? (
    <StandardDieDisplay
      key={die.id}
      die={die}
      index={i}
      playerId={playerId}
      roomId={roomId}
      removeDie={removeDie}
    />
  ) : diceStyle === "genesys" ? (
    <GenesysDieDisplay
      key={die.id}
      die={die}
      index={i}
      inputResult={inputResult}
      setRolled={setRolled}
      removeDie={removeDie}
      sess={[roomId, playerId]}
    />
  ) : null;
}
