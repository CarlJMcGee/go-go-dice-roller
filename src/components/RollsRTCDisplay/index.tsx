// create FC to display dice rolls and the user who rolled them

import React, { useEffect, useState } from "react";
import type { DieRollFull } from "../../types/Dice";
import { ScrollArea, Select } from "@mantine/core";
import RollDisplay from "./RollDisplay";
import { SetPlus } from "@carljmcgee/set-map-plus";

interface DiceRollProps {
  rolls: DieRollFull[];
}

const DiceRoll: React.FC<DiceRollProps> = ({ rolls: rollsRaw }) => {
  const [rolls, setRolls] = useState(rollsRaw);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  function getPlayersFromRolls(rolls: DieRollFull[]) {
    const playersSet = SetPlus(rolls.map((roll) => roll.user.playerName));
    return playersSet.toArr();
  }

  useEffect(() => {
    if (selectedPlayer === null) {
      setRolls(rollsRaw);
      return;
    }

    setRolls(
      rollsRaw.filter((roll) => roll.user.playerName === selectedPlayer)
    );
  }, [selectedPlayer, rollsRaw]);

  return (
    <div className="my-3 mr-3 rounded-md bg-[#627899] bg-opacity-75 text-center text-white md:w-1/2">
      <h3 className="text-4xl underline">Party Rolls</h3>
      <Select
        className="mx-auto mt-3 w-2/3 md:max-w-md"
        placeholder="Select a player"
        data={getPlayersFromRolls(rollsRaw)}
        onChange={setSelectedPlayer}
        searchable
        nothingFound="No Players Found"
        clearable
      />
      <ScrollArea h={430} type="always">
        <ul className="p-2 pt-2 text-left">
          {rolls.length > 0 &&
            rolls.map((roll) => <RollDisplay roll={roll} key={roll.id} />)}
        </ul>
      </ScrollArea>
    </div>
  );
};

export default DiceRoll;
