// FC called RollDisplay the takes the prop roll that is a DieRollFull type

import React from "react";
import type { DieRollFull } from "../../../types/Dice";
import moment from "moment";

interface RollDisplayProps {
  roll: DieRollFull;
}

const RollDisplay: React.FC<RollDisplayProps> = ({ roll }) => {
  return (
    <li>
      {roll.user.charName} rolled{" "}
      <span
        className={`font-bold ${
          roll.outcome === "20"
            ? "text-green-500"
            : roll.outcome === "1"
            ? "text-red-400"
            : "text-yellow-300"
        }`}
      >
        {roll.outcome}
      </span>{" "}
      <span className="text-xs">({moment(roll.created).fromNow()})</span>
    </li>
  );
};

export default RollDisplay;
