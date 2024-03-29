import { MapPlus } from "@carljmcgee/set-map-plus";
import type { FakeDie, FakeDieColors } from "../../types/Dice";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import type { genDieFaces, genDieTypes } from "../../types/genesysDice";
import { numBetween } from "@carljmcgee/lol-random";
import {
  abilityDie,
  boostDie,
  challengeDie,
  difficultyDie,
  proficiencyDie,
  setbackDie,
} from "../../utils/go-dice-genesys-hooks";
import { CloseButton, Group } from "@mantine/core";
import { RollAllAtom } from "../../utils/stateStore";
import { useAtom } from "jotai";
import Image from "next/image";
import rollingGif from "../../media/dice-roll.gif";
import { trpc } from "../../utils/api";
import { getDieSymbol } from "../../utils/go-dice-genesys-hooks/src";

interface GenesysFakeDieDisplayProps {
  die: FakeDie;
  removeDie: (die: FakeDie) => void;
  inputResult: (values: genDieFaces[]) => void;
  setGenRolled: Dispatch<SetStateAction<boolean>>;
  sess: [roomId: string, userId: string];
}

export default function GenesysFakeDieDisplay({
  die,
  removeDie,
  inputResult,
  setGenRolled,
  sess,
}: GenesysFakeDieDisplayProps) {
  const [label, setLabel] = useState(`New Die`);
  const [editing, setEditing] = useState(false);
  const [dieType, setDieType] = useState<genDieTypes>("boost");
  const [dieColor, setColor] = useState<FakeDieColors>("white");
  const [rolling, setRolling] = useState(false);
  const [value, setValue] = useState<genDieFaces[]>();
  const [symbol, setSymbol] = useState<string | undefined>(undefined);

  const [rollAllFlag, _] = useAtom(RollAllAtom);

  const { mutate: sendRoll } = trpc.dieRoll.add.useMutation();

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

  function getDieSides(dieType: genDieTypes): number {
    switch (dieType) {
      case "boost":
        return 6;
      case "ability":
        return 8;
      case "proficiency":
        return 12;
      case "setback":
        return 6;
      case "difficulty":
        return 8;
      case "challenge":
        return 12;
    }
  }

  function getGenValue(dieType: genDieTypes): genDieFaces[] {
    const sideUp = numBetween(1, getDieSides(dieType));
    switch (dieType) {
      case "boost":
        return boostDie.get(sideUp) as genDieFaces[];
      case "ability":
        return abilityDie.get(sideUp) as genDieFaces[];
      case "proficiency":
        return proficiencyDie.get(sideUp) as genDieFaces[];
      case "setback":
        return setbackDie.get(sideUp) as genDieFaces[];
      case "difficulty":
        return difficultyDie.get(sideUp) as genDieFaces[];
      case "challenge":
        return challengeDie.get(sideUp) as genDieFaces[];
    }
  }

  async function rollDie() {
    setRolling(true);
    await new Promise((res) => setTimeout(res, 1000));
    setValue(getGenValue(dieType));
    setRolling(false);
  }

  useEffect(() => {
    if (rollAllFlag) {
      void rollDie();
    }
  }, [rollAllFlag]);

  useEffect(() => {
    if (!value) {
      return;
    }

    inputResult(value);
    setGenRolled(true);

    setSymbol(getDieSymbol(value));

    sendRoll({
      outcome: value.join(" + "),
      roomId: sess[0],
      playerId: sess[1],
    });
  }, [value]);

  return (
    <div
      className={`m-1 flex h-52 w-52 flex-col justify-self-center border-4 p-3 ${
        borderColorMap.get(dieType) ?? ""
      } 
        ${bgColorMap.get(dieType) ?? ""} ${
        dieType === "setback" ? "text-white" : ""
      }`}
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
            removeDie(die);
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
      </div>
      <button
        className={`m-2 w-1/2 self-center rounded-md bg-[#00b4ff] ${
          borderColorMap.get(dieType) ?? ""
        }`}
        onClick={() => rollDie()}
      >
        Roll
      </button>
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
