import { CloseButton, Group } from "@mantine/core";
import { FakeDie, FakeDieColors } from "../../types/Dice";
import { useState } from "react";
import { DieTypes } from "../../utils/go-dice-api/src/die";

interface StandardFakeDieDisplayProps {
  die: FakeDie;
  key: string;
  index: number;
  removeDie: (die: FakeDie) => void;
}

export default function StandardFakeDieDisplay({
  die,
  key,
  index,
  removeDie,
}: StandardFakeDieDisplayProps) {
  // state
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(die.label);
  const [dieType, setDieType] = useState<DieTypes>("D6");
  const [rolling, setRolling] = useState(false);
  const [value, setValue] = useState<string>();

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

  return (
    <div
      className={`m-1 flex h-52 w-52 flex-col justify-self-center border-4 p-3 ${
        bgColor[die.color]
      } ${borderColor[die.color]}`}
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
        <select
          name="dieType"
          id="dieType"
          className={`border-2 bg-transparent bg-black bg-opacity-20 ${
            borderColor[die.color]
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
      </div>
      <div className="flex h-full items-center justify-center text-center">
        {rolling ? <h3 className="text-4xl">Rolling...</h3> : null}
        {!rolling && value ? (
          <h3 className="text-7xl text-black">{value}</h3>
        ) : null}
      </div>
    </div>
  );
}
