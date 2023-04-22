// create FC to display dice rolls and the user who rolled them

import React from "react";
import type { DieRollFull } from "../../types/Dice";
import { ScrollArea } from "@mantine/core";
import RollDisplay from "./RollDisplay";

interface DiceRollProps {
  rolls: DieRollFull[];
}

const DiceRoll: React.FC<DiceRollProps> = ({ rolls }) => {
  return (
    <div className="my-3 mr-3 w-1/2 bg-gray-400 bg-opacity-75 text-center text-white md:w-1/3">
      <h3 className="text-4xl underline">Party Rolls</h3>
      <ScrollArea h={250} type="always">
        <ul className="pl-5 pt-2 text-left">
          {rolls.length > 0 &&
            rolls.map((roll) => <RollDisplay roll={roll} key={roll.id} />)}
        </ul>
      </ScrollArea>
    </div>
  );
};

export default DiceRoll;
