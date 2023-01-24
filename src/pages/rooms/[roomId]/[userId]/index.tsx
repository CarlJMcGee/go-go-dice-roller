import { NextPage } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useState } from "react";
import { trpc } from "../../../../utils/api";
import { useDiceSet } from "../../../../utils/go-dice-react";
import { useGenesysResult } from "../../../../utils/go-dice-genesys-hooks";
import Head from "next/head";
import DieDisplay from "../../../../components/DieDisplay";
import type { DiceType } from "../../../../types/Dice";

const RoomSession: NextPage = () => {
  // router
  const router = useRouter();
  interface RoomSessParams extends ParsedUrlQuery {
    roomId?: string;
    userId?: string;
  }
  const { roomId, userId }: RoomSessParams = router.query;

  // state
  const [diceSet, setDiceSet] = useState<DiceType>("standard");

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
              onChange={(e) => setDiceSet(e.target.value as DiceType)}
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
      <div className="tableTex mx-auto mb-10 min-h-screen w-4/5 rounded-md">
        <div className="flex justify-center text-center text-4xl text-white">
          {genesys.rolled && (
            <h3>{`${genesys.crit && genesys.crit} ${genesys.outcome} ${
              genesys.sideEffects && `with ${genesys.sideEffects}`
            }`}</h3>
          )}
          {genesys.rolled && (
            <button
              className="rounded-md bg-gray-400 px-2 py-1 hover:bg-gray-600"
              onClick={() => genesys.resetResults()}
            >
              Reset
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 items-start md:grid-cols-3">
          {dice.map((die, i) => (
            <DieDisplay
              key={die.id}
              diceSet={diceSet}
              die={die}
              index={i}
              inputResult={genesys.inputResult}
              setRolled={genesys.setRolled}
              removeDie={removeDie}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default RoomSession;
