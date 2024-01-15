import { MapPlus } from "@carljmcgee/set-map-plus";
import type { Die } from "../../utils/go-dice-api";
import { useEffect, useState } from "react";
import type { genDieFaces, genDieTypes } from "../../types/genesysDice";
import {
  useBatteryLevel,
  useConnectionStatus,
  useDieColor,
  useRolling,
} from "../../utils/go-dice-react";
import type { DieTypes } from "../../utils/go-dice-api/src/die";
import { useGenesysDie } from "../../utils/go-dice-genesys-hooks";
import { CloseButton, Group } from "@mantine/core";
import Image from "next/image";
import { trpc } from "../../utils/api";
import rollingGif from "../../media/dice-roll.gif";
import { getDieSymbol } from "../../utils/go-dice-genesys-hooks/src";

export interface IDieDisplayProps {
  die: Die;
  index: number;
  inputResult: (values: genDieFaces[]) => void;
  setRolled: React.Dispatch<React.SetStateAction<boolean>>;
  removeDie: (dieId: string) => void;
  sess: [roomId: string, userId: string];
}

export default function GenesysDieDisplay({
  die,
  index: i,
  inputResult,
  setRolled,
  removeDie,
  sess,
}: IDieDisplayProps) {
  const [label, setLabel] = useState(`Die #${i + 1}`);
  const [editing, setEditing] = useState(false);
  const [dieType, setDieType] = useState<genDieTypes>("boost");
  const [symbol, setSymbol] = useState<string | undefined>(undefined);

  const connected = useConnectionStatus(die);
  const dieColor = useDieColor(die);
  const batteryLvl = useBatteryLevel(die);
  const rolling = useRolling(die);
  const value = useGenesysDie(die, dieType);

  const { mutate: sendRoll } = trpc.dieRoll.add.useMutation();

  useEffect(() => {
    const genToDFace: Record<genDieTypes, DieTypes> = {
      ability: "D8",
      proficiency: "D12",
      boost: "D6",
      difficulty: "D8",
      challenge: "D12",
      setback: "D6",
    };
    die.setDieType(genToDFace[dieType]);
  }, [dieType, die]);

  useEffect(() => {
    if (!value) {
      return;
    }
    setRolled(true);
    inputResult(value);

    setSymbol(getDieSymbol(value));

    sendRoll({
      outcome: value.join(" + "),
      roomId: sess[0],
      playerId: sess[1],
    });
  }, [value]);

  useEffect(() => {
    if (!connected) {
      removeDie(die.id);
    }
  }, [connected]);

  const borderColorMap = MapPlus<string, string>([
    ["boost", "border-sky-600"],
    ["ability", "border-green-600"],
    ["proficiency", "border-yellow-600"],
    ["challenge", "border-red-600"],
    ["difficulty", "border-indigo-600"],
    ["setback", "border-black"],
  ]);
  const bgColorMap = MapPlus<string, string>([
    ["boost", "bg-sky-400"],
    ["ability", "bg-green-400"],
    ["proficiency", "bg-yellow-400"],
    ["challenge", "bg-red-400"],
    ["difficulty", "bg-indigo-400"],
    ["setback", "bg-gray-700"],
  ]);

  return (
    <div
      className={`m-1 flex h-52 w-52 flex-col justify-self-center border-4 p-3 ${
        borderColorMap.get(dieType) ?? ""
      } 
        ${bgColorMap.get(dieType) ?? ""}`}
    >
      <Group position="apart">
        {editing ? (
          <input
            type={"text"}
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setEditing(false);
              }
            }}
            onBlur={() => {
              setEditing(false);
            }}
            className={`w-3/4 bg-transparent`}
          />
        ) : (
          <h2 onClick={() => setEditing(true)} className="text-center">
            {label}
          </h2>
        )}
        <CloseButton
          color="red"
          onClick={() => {
            removeDie(die.id);
          }}
        />
      </Group>
      <div className="text-center">
        <select
          name="dieType"
          id="dieType"
          className={`border-2 bg-black bg-transparent bg-opacity-20 text-center ${
            dieColor && (borderColorMap.get(dieColor) ?? "")
          } hover:bg-black hover:bg-opacity-30`}
          onChange={(e) => setDieType(e.target.value as genDieTypes)}
        >
          <option value="boost">boost - D6</option>
          <option value="ability">ability - D8</option>
          <option value="proficiency">proficiency - D12</option>
          <option value="setback">setback - D6</option>
          <option value="difficulty">difficulty - D8</option>
          <option value="challenge">challenge - D12</option>
        </select>
        <h3>
          Battery currently at{" "}
          <span
            className={`font-semibold ${
              batteryLvl && batteryLvl > 10
                ? "text-black"
                : "animate-pulse text-red-500"
            }`}
          >
            {batteryLvl}%
          </span>
        </h3>
      </div>
      <div className="flex h-full items-center justify-center text-center">
        {rolling ? (
          <Image src={rollingGif} alt="rolling" width={50} height={50} />
        ) : null}
        {!rolling && value ? (
          symbol !== "blank" ? (
            <Image
              src={symbol ?? ""}
              alt={value?.join(" ") ?? ""}
              width={90}
              height={90}
            />
          ) : (
            <h3 className="text-4xl font-bold">[ Blank ]</h3>
          )
        ) : null}
      </div>
    </div>
  );
}
