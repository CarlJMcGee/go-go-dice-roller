// FC called RollDisplay the takes the prop roll that is a DieRollFull type

import React, { useEffect, useState } from "react";
import type { DieRollFull } from "../../../types/Dice";
import moment from "moment";
import { getDieSymbol } from "../../../utils/go-dice-genesys-hooks/src";
import { genDieFaces } from "../../../types/genesysDice";
import Image from "next/image";

interface RollDisplayProps {
  roll: DieRollFull;
}

const RollDisplay: React.FC<RollDisplayProps> = ({ roll }) => {
  const [symbol, setSymbol] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (Number.parseInt(roll.outcome)) return;

    if (/Succ|Adv|Dis|Fail|Despr|Trph/g.test(roll.outcome)) {
      setSymbol(undefined);
      return;
    }

    setSymbol(getDieSymbol(roll.outcome.split(" + ") as genDieFaces[]));
  }, []);

  return (
    <li
      className={`m-2 flex  flex-col rounded-lg ${
        roll.outcome === "20"
          ? "bg-green-800"
          : roll.outcome === "1"
          ? "bg-[#ff7984]"
          : "bg-[#00b4ff]"
      } bg-opacity-75`}
    >
      <h3 className="ml-3 mt-3 text-2xl">{roll.player.playerName}</h3>
      <div className="mb-4 flex items-center justify-center gap-1">
        <p className="mr-3 text-center text-xl">
          {roll.player.charName} Rolled a
          {!symbol && (
            <span className="text-3xl font-bold"> {roll.outcome}</span>
          )}
        </p>
        {symbol &&
          (symbol !== "blank" ? (
            <Image
              src={symbol ?? ""}
              alt={roll.outcome}
              width={80}
              height={80}
            />
          ) : (
            <span className="text-3xl font-bold">[Blank]</span>
          ))}
        <p> </p>
        <p className="text-sm">{moment(roll.created).fromNow()}</p>
      </div>
    </li>
  );
};

export default RollDisplay;
