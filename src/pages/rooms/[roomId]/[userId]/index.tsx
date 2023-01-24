import { NextPage } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useState } from "react";
import { trpc } from "../../../../utils/api";
import { useDiceSet } from "../../../../utils/go-dice-react";
import { useGenesysResult } from "../../../../utils/go-dice-genesys-hooks";
import Head from "next/head";
import { useGenesysDie } from "../../../../utils/go-dice-genesys-hooks";
import DieDisplay from "../../../../components/DieDisplay";
import type { DiceType } from "../../../../types/Dice";
import { useElementSize } from "@mantine/hooks";

const RoomSession: NextPage = () => {
  // router
  const router = useRouter();
  interface RoomSessParams extends ParsedUrlQuery {
    roomId?: string;
    userId?: string;
  }
  const { roomId, userId }: RoomSessParams = router.query;

  // state
  const [diceType, setDiceType] = useState<DiceType>("standard");

  // trpc calls
  const { data: room, isLoading: roomLoading } = trpc.room.getOne.useQuery({
    roomId: roomId ?? "",
  });
  const { data: user, isLoading: userLoading } = trpc.user.getOne.useQuery({
    userId: userId ?? "",
  });

  // go dice
  const [dice, requestDie, removeDie] = useDiceSet();
  const genesys = useGenesysResult();

  useEffect(() => {
    return () => {
      dice.forEach((die) => {
        die.disconnect();
      });
    };
  }, []);

  if (roomLoading || userLoading) {
    return (
      <div>
        <h1>Joining Room Session...</h1>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3">
        <div></div>
        <div className="flex flex-col justify-center">
          <Head>
            <title>
              {room?.name}: {user?.charName}
            </title>
          </Head>
          <h1 className="text-center text-4xl">{room?.name}</h1>
          <h2 className="text-center text-2xl">
            Character Name: {user?.charName}
          </h2>
          <h2 className="text-center text-2xl">
            Player Name: {user?.playerName}
          </h2>
          <ol className="flex flex-col justify-center">
            {user?.dieRolls.map((roll) => (
              <li>{roll.outcome}</li>
            ))}
          </ol>
          <div>
            <button
              className="m-4 h-12 w-12 self-center rounded-md border-4 border-double border-gray-700 bg-gray-400 text-sm text-white"
              onClick={() => requestDie()}
            >
              Add Die
            </button>
            <select
              name="dice-type"
              id="dice-type"
              onChange={(e) => setDiceType(e.target.value as DiceType)}
            >
              <option value="standard">Standard</option>
              <option value="genesys">Genesys</option>
            </select>
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-3xl underline">Characters</h3>
          <ol>
            {room?.players.map((player) => (
              <li key={player.id} className="list-inside list-disc">
                {player.charName}
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="tableTex mx-auto grid min-h-screen w-4/5 grid-cols-1 items-start rounded-md md:grid-cols-3">
        {dice.map((die, i) => (
          <DieDisplay
            key={die.id}
            diceType={diceType}
            die={die}
            index={i}
            inputResult={genesys.inputResult}
            setRolled={genesys.setRolled}
            removeDie={removeDie}
          />
        ))}
      </div>
    </>
  );
};

export default RoomSession;
