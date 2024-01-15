import { useEffect, useState } from "react";
import Image from "next/image";
import { trpc } from "../../utils/api";
import { MapPlus } from "@carljmcgee/set-map-plus";
import type { Die } from "../../utils/go-dice-api";
import {
  useDieValue,
  useRolling,
  useDieColor,
  useBatteryLevel,
  useConnectionStatus,
} from "../../utils/go-dice-react";
import type { DieTypes } from "../../utils/go-dice-api/src/die";
import { CloseButton, Group } from "@mantine/core";
import rollingGif from "../../media/dice-roll.gif";

export interface IDieDisplayProps {
  die: Die;
  index: number;
  playerId: string;
  roomId: string;
  removeDie: (dieId: string) => void;
}

const borderColorMap = MapPlus<string, string>([
  ["Black", "border-black"],
  ["Red", "border-red-400"],
  ["Green", "border-green-400"],
  ["Blue", "border-blue-400"],
  ["Yellow", "border-yellow-400"],
  ["Orange", "border-orange-400"],
]);
const bgColorMap = MapPlus<string, string>([
  ["Black", "bg-gray-200"],
  ["Red", "bg-red-200"],
  ["Green", "bg-green-200"],
  ["Blue", "bg-blue-200"],
  ["Yellow", "bg-yellow-200"],
  ["Orange", "bg-orange-200"],
]);

export default function DieDisplay({
  die,
  index: i,
  playerId,
  roomId,
  removeDie,
}: IDieDisplayProps) {
  const [label, setLabel] = useState(`Die #${i + 1}`);
  const [editing, setEditing] = useState(false);
  const [dieType, setDieType] = useState<DieTypes>("D6");

  // trpc
  const { mutate: sendRoll } = trpc.dieRoll.add.useMutation();

  const connected = useConnectionStatus(die);
  const batteryLvl = useBatteryLevel(die);
  const dieColor = useDieColor(die);
  const rolling = useRolling(die);
  const value = useDieValue(die);

  useEffect(() => {
    die.setDieType(dieType);
  }, [dieType]);

  useEffect(() => {
    if (!connected) {
      removeDie(die.id);
    }
  }, [connected]);

  useEffect(() => {
    sendRoll({ outcome: value, roomId: roomId, playerId: playerId });
  }, [value]);

  return (
    <div
      className={`m-1 flex h-52 w-52 flex-col justify-self-center border-4 px-3 pb-3 ${
        dieColor ? borderColorMap.get(dieColor) ?? "" : "border-white"
      } ${dieColor ? bgColorMap.get(dieColor) ?? "" : "bg-gray-200"}`}
    >
      <Group position="right">
        <CloseButton
          color="red"
          onClick={() => {
            die.disconnect();
            removeDie(die.id);
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
            onBlur={() => {
              setEditing(false);
            }}
            className={`w-5/6 bg-transparent`}
          />
        ) : (
          <h2 onClick={() => setEditing(true)}>{label}</h2>
        )}
        <select
          name="dieType"
          id="dieType"
          className={`border-2 bg-black bg-transparent bg-opacity-20 ${
            dieColor && (borderColorMap.get(dieColor) ?? "")
          } hover:bg-black hover:bg-opacity-30`}
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
        {batteryLvl === 100 ? (
          <h3>
            Battery <span className="font-semibold">100%</span>
          </h3>
        ) : (
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
        )}{" "}
      </div>
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
