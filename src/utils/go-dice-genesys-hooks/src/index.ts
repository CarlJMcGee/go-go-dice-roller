import { useEffect, useState } from "react";
import { Die } from "../../go-dice-api/index.js";
import { MapPlus } from "@carljmcgee/set-map-plus";
import succ from "./assets/success.webp";
import sucSuc from "./assets/success_success.webp";
import sucAdv from "./assets/success_advantage.webp";
import adv from "./assets/advantage.webp";
import advAdv from "./assets/advantage_advantage.webp";
import tri from "./assets/triumph.webp";
import fail from "./assets/failure.webp";
import failFail from "./assets/failure_failure.webp";
import failThreat from "./assets/failure_threat.webp";
import threat from "./assets/threat.webp";
import threatThreat from "./assets/threat_threat.webp";
import despair from "./assets/despair.webp";

export type posDieFaces = "success" | "advantage" | "triumph" | "blank";
export type negDieFaces = "failure" | "threat" | "despair" | "blank";
export type genDieFaces =
  | "success"
  | "advantage"
  | "triumph"
  | "blank"
  | "failure"
  | "threat"
  | "despair";

export type posDieTypes = "proficiency" | "ability" | "boost";

export type negDieTypes = "challenge" | "difficulty" | "setback";

export type genDieTypes =
  | "proficiency"
  | "ability"
  | "boost"
  | "challenge"
  | "difficulty"
  | "setback";

export const proficiencyDie = MapPlus<number, genDieFaces[]>([
  [1, ["blank"]],
  [2, ["success"]],
  [3, ["advantage", "advantage"]],
  [4, ["advantage", "success"]],
  [5, ["advantage"]],
  [6, ["success", "success"]],
  [7, ["success"]],
  [8, ["success", "success"]],
  [9, ["advantage", "success"]],
  [10, ["advantage", "success"]],
  [11, ["advantage", "advantage"]],
  [12, ["triumph"]],
]);

export const abilityDie = MapPlus<number, genDieFaces[]>([
  [1, ["blank"]],
  [2, ["advantage", "success"]],
  [3, ["advantage"]],
  [4, ["advantage", "advantage"]],
  [5, ["success"]],
  [6, ["success", "success"]],
  [7, ["advantage"]],
  [8, ["success"]],
]);

export const boostDie = MapPlus<number, genDieFaces[]>([
  [1, ["blank"]],
  [2, ["success"]],
  [3, ["advantage", "advantage"]],
  [4, ["advantage", "success"]],
  [5, ["advantage"]],
  [6, ["blank"]],
]);

export const challengeDie = MapPlus<number, genDieFaces[]>([
  [1, ["despair"]],
  [2, ["failure"]],
  [3, ["threat", "threat"]],
  [4, ["threat", "failure"]],
  [5, ["failure", "failure"]],
  [6, ["threat"]],
  [7, ["failure"]],
  [8, ["threat"]],
  [9, ["failure", "failure"]],
  [10, ["threat", "failure"]],
  [11, ["threat", "threat"]],
  [12, ["blank"]],
]);

export const difficultyDie = MapPlus<number, genDieFaces[]>([
  [1, ["failure"]],
  [2, ["threat"]],
  [3, ["failure", "threat"]],
  [4, ["threat"]],
  [5, ["blank"]],
  [6, ["threat", "threat"]],
  [7, ["threat"]],
  [8, ["failure", "failure"]],
]);

export const setbackDie = MapPlus<number, genDieFaces[]>([
  [1, ["blank"]],
  [2, ["failure"]],
  [3, ["threat"]],
  [4, ["threat"]],
  [5, ["failure"]],
  [6, ["blank"]],
]);

function proficiencyDieValue(value: string): genDieFaces[] {
  const roll = proficiencyDie.get(Number.parseInt(value));
  if (!roll) return ["blank"];
  return roll;
}

function abilityDieValue(value: string): genDieFaces[] {
  const roll = abilityDie.get(Number.parseInt(value));
  if (!roll) return ["blank"];
  return roll;
}

function boostDieValue(value: string): genDieFaces[] {
  const roll = boostDie.get(Number.parseInt(value));
  if (!roll) return ["blank"];
  return roll;
}

function challengeDieValue(value: string): genDieFaces[] {
  const roll = challengeDie.get(Number.parseInt(value));
  if (!roll) return ["blank"];
  return roll;
}
function difficultyDieValue(value: string): genDieFaces[] {
  const roll = difficultyDie.get(Number.parseInt(value));
  if (!roll) return ["blank"];
  return roll;
}
function setbackDieValue(value: string): genDieFaces[] {
  const roll = setbackDie.get(Number.parseInt(value));
  if (!roll) return ["blank"];
  return roll;
}
const GenValueMap = MapPlus<genDieTypes, (value: string) => genDieFaces[]>([
  ["boost", boostDieValue],
  ["ability", abilityDieValue],
  ["proficiency", proficiencyDieValue],
  ["setback", setbackDieValue],
  ["difficulty", difficultyDieValue],
  ["challenge", challengeDieValue],
]);

export function useGenesysDie(die: Die, dieType: genDieTypes) {
  const [value, setValue] = useState<string | undefined>();
  const [genValue, setGenValue] = useState<genDieFaces[]>();
  useEffect(() => {
    const onValue = (value: string) => setValue(value);
    die.on("value", onValue);

    const dieValueHandler = GenValueMap.get(dieType);
    if (dieValueHandler && value) {
      setGenValue(dieValueHandler(value));
    }

    return () => die.off("value", onValue);
  }, [value]);

  return genValue;
}

export function useGenesysResult(): {
  success: number;
  triumph: number;
  advantage: number;
  rolled: boolean;
  setRolled: React.Dispatch<React.SetStateAction<boolean>>;
  outcome: string;
  sideEffects: string;
  crit: string;
  inputResult: (values: genDieFaces[]) => void;
  resetResults: () => void;
} {
  const [triumph, setTriumph] = useState(0);
  const [success, setSuccess] = useState(0);
  const [advantage, setAdvantage] = useState(0);
  const [rolled, setRolled] = useState(false);
  const [outcome, setOutcome] = useState<string>("");
  const [sideEffects, setSideEffects] = useState<string>("");
  const [crit, setCrit] = useState("");

  useEffect(() => {
    setOutcome(success > 0 ? "Success" : "Failure");
    setSideEffects(
      advantage > 0 ? "Advantage!" : advantage < 0 ? "Disadvantage!" : ""
    );
    setCrit(triumph > 0 ? "Triumphant" : triumph < 0 ? "Despairing" : "");
  }, [success, advantage, triumph]);

  function inputResult(values: genDieFaces[]) {
    values.forEach((value) => {
      switch (value) {
        case "success":
          setSuccess((prev) => prev + 1);
          break;
        case "advantage":
          setAdvantage((prev) => prev + 1);
          break;
        case "triumph":
          setSuccess((prev) => prev + 1);
          setTriumph((prev) => prev + 1);
          break;
        case "failure":
          setSuccess((prev) => prev - 1);
          break;
        case "threat":
          setAdvantage((prev) => prev - 1);
          break;
        case "despair":
          setSuccess((prev) => prev - 1);
          setTriumph((prev) => prev - 1);
          break;
        case "blank":
          break;
      }
    });
  }

  function resetResults() {
    setSuccess(0);
    setAdvantage(0);
    setTriumph(0);
    setOutcome("");
    setSideEffects("");
    setCrit("");
    setRolled(false);
  }

  return {
    success: success,
    triumph: triumph,
    advantage: advantage,
    rolled: rolled,
    setRolled: setRolled,
    outcome: outcome,
    sideEffects: sideEffects,
    crit: crit,
    inputResult: inputResult,
    resetResults: resetResults,
  };
}

export function getDieSymbol(results: genDieFaces[]): string {
  if (results.length === 0) return "blank";

  switch (results.sort().join(" ")) {
    case "success":
      return succ.src;
    case "success success":
      return sucSuc.src;

    case "advantage success":
      return sucAdv.src;
    case "advantage":
      return adv.src;
    case "advantage advantage":
      return advAdv.src;

    case "triumph":
      return tri.src;

    case "failure":
      return fail.src;
    case "failure failure":
      return failFail.src;
    case "failure threat":
      return failThreat.src;

    case "threat":
      return threat.src;
    case "threat threat":
      return threatThreat.src;

    case "despair":
      return despair.src;
    default:
      return "blank";
  }
}
