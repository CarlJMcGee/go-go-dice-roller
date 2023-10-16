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
      <h3 className="mt-3 ml-3 text-2xl">{roll.user.playerName}</h3>
      <div className="mb-4 flex items-center justify-center">
        <p className="mr-3 text-center text-xl">
          {roll.user.charName} Rolled a
          {!symbol && (
            <span className="text-3xl font-bold"> {roll.outcome}</span>
          )}
        </p>
        {symbol && symbol !== "blank" && (
          <Image src={symbol ?? ""} alt={roll.outcome} width={80} height={80} />
        )}
        <p className="text-sm">{moment(roll.created).fromNow()}</p>
      </div>
    </li>
  );
};

export default RollDisplay;
