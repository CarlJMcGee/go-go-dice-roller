import { CloseButton, Group } from "@mantine/core";
import type { FakeDie, FakeDieColors } from "../../types/Dice";
import { useState, useEffect } from "react";
import type { DieTypes } from "../../utils/go-dice-api/src/die";
import { numBetween } from "@carljmcgee/lol-random";
import { trpc } from "../../utils/api";
import rollingGif from "../../media/dice-roll.gif";
import Image from "next/image";
import { RollAllAtom } from "../../utils/stateStore";
import { useAtom } from "jotai";

interface StandardFakeDieDisplayProps {
  die: FakeDie;
  removeDie: (die: FakeDie) => void;
  sess: [roomId: string, userId: string];
}

export default function StandardFakeDieDisplay({
  die,
  removeDie,
  sess,
}: StandardFakeDieDisplayProps) {
  // state
  const [dieColor, setColor] = useState<FakeDieColors>("white");
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(die.label);
  const [dieType, setDieType] = useState<DieTypes>("D6");
  const [rolling, setRolling] = useState(false);
  const [value, setValue] = useState<string>();

  const [rollAllFlag, _] = useAtom(RollAllAtom);

  // trpc
  const { mutate: sendRoll } = trpc.dieRoll.add.useMutation();

  const bgColor: Record<FakeDieColors, string> = {
    white: "bg-gray-300",
    red: "bg-red-300",
    orange: "bg-orange-300",
    yellow: "bg-yellow-300",
    green: "bg-green-300",
    blue: "bg-blue-300",
  };

  const borderColor: Record<FakeDieColors, string> = {
    white: "border-white",
    red: "border-red-500",
    orange: "border-orange-500",
    yellow: "border-yellow-500",
    green: "border-green-500",
    blue: "border-blue-500",
  };

  const dieSides: Record<DieTypes, number> = {
    D6: 6,
    D4: 4,
    D8: 8,
    D10: 10,
    D10X: 10,
    D12: 12,
    D20: 20,
  };

  async function rollDie() {
    setRolling(true);
    await new Promise((res) => setTimeout(res, 1000));
    setValue(numBetween(1, dieSides[dieType]).toString());
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

    sendRoll({ outcome: value, roomId: sess[0], userId: sess[1] });
  }, [value]);

  return (
    <div
      className={`m-1 flex h-52 w-52 flex-col justify-self-center border-4 px-3 pb-3 ${bgColor[dieColor]} ${borderColor[dieColor]}`}
    >
      <Group position="right">
        <CloseButton
          color="red"
          onClick={() => {
            removeDie(die);
          }}
        />
      </Group>
      <div className="text-center">
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
            onBlur={(e) => {
              setEditing(false);
            }}
            className={`w-5/6 bg-transparent`}
          />
        ) : (
          <h2 onClick={() => setEditing(true)}>{label}</h2>
        )}
        <Group position="center">
          <select
            name="dieType"
            id="dieType"
            className={`border-2 bg-transparent bg-black bg-opacity-20 ${borderColor[dieColor]} hover:bg-black hover:bg-opacity-30`}
            onChange={(e) => setDieType(e.target.value as DieTypes)}
          >
            <option value="D6" defaultChecked>
              D6
            </option>
            <option value="D4">D4</option>
            <option value="D8">D8</option>
            <option value="D10">D10</option>
            <option value="D12">D12</option>
            <option value="D10X">D10X</option>
            <option value="D20">D20</option>
          </select>
          <select
            name="dieColor"
            id="dieColor"
            onChange={(e) => setColor(e.currentTarget.value as FakeDieColors)}
          >
            <option value="white" className="text-black">
              White
            </option>
            <option value="red" className="text-red-500">
              Red
            </option>
            <option value="orange" className="text-orange-500">
              Orange
            </option>
            <option value="yellow" className="text-yellow-500">
              Yellow
            </option>
            <option value="green" className="text-green-500">
              Green
            </option>
            <option value="blue" className="text-blue-500">
              Blue
            </option>
          </select>
        </Group>
      </div>
      <button
        className={`m-2 w-1/2 self-center rounded-md bg-[#00b4ff] ${borderColor[dieColor]}`}
        onClick={() => rollDie()}
      >
        Roll
      </button>
      <div className="flex h-full items-center justify-center text-center">
        {rolling ? (
          <Image src={rollingGif} alt="rolling" width={50} height={50} />
        ) : null}
        {!rolling && value ? (
          <h3 className="text-7xl text-black">{value}</h3>
        ) : null}
      </div>
    </div>
  );
}
