// FC called RollDisplay the takes the prop roll that is a DieRollFull type

import React from "react";
import type { DieRollFull } from "../../../types/Dice";
import moment from "moment";

interface RollDisplayProps {
  roll: DieRollFull;
}

const RollDisplay: React.FC<RollDisplayProps> = ({ roll }) => {
  return (
    <li
      className={`m-2 flex  flex-col rounded-lg ${
        roll.outcome === "20"
          ? "bg-green-500"
          : roll.outcome === "1"
          ? "bg-[#ff7984]"
          : "bg-[#00b4ff]"
      } bg-opacity-75`}
    >
      <h3 className="mt-3 ml-3 text-2xl">{roll.user.playerName}</h3>
      <div className="mb-4 flex items-center justify-center">
        <div></div>
        <p className="mr-3 text-center text-xl">
          {roll.user.charName} Rolled a{" "}
          <span className="text-3xl font-bold">{roll.outcome}</span>
        </p>
        <p className="text-sm">{moment(roll.created).fromNow()}</p>
      </div>
    </li>
  );
};

export default RollDisplay;
