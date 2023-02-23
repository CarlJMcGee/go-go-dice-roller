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
import { IMapPlus, ISetPlus, MapPlus, SetPlus } from "@carljmcgee/set-map-plus";
import { User } from "@prisma/client";
import {
  pusherClient,
  usePresenceChannel,
  usePrivatePusherClient,
} from "../../../../utils/pusher-store";
import { Members } from "pusher-js";
import { Member } from "../../../../types/pusher";

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
  const [membersList, updateMembers] = useState<
    { id: string; info: { username: string } }[]
  >([]);

  // trpc calls
  const utils = trpc.useContext();
  const { data: room, isLoading: roomLoading } = trpc.room.getOne.useQuery({
    roomId: roomId ?? "",
  });
  const { data: player, isLoading: userLoading } = trpc.user.getOne.useQuery(
    {
      userId: userId ?? "",
    },
    {
      onSuccess(user) {
        // setUserOnline({ userId: user.id });
      },
    }
  );
  // const { data: activePlayers, refetch: getPlayers } =
  //   trpc.user.inRoom.useQuery(
  //     { roomId: roomId ?? "" },
  //     {
  //       refetchInterval: 3000,
  //     }
  //   );
  const { mutate: setUserOnline } = trpc.user.login.useMutation();
  const { mutate: setUserOffline } = trpc.user.logout.useMutation();

  // go dice
  const [dice, requestDie, removeDie] = useDiceSet();
  const genesys = useGenesysResult();

  // pusher
  const pusher = usePrivatePusherClient("clehck0ol0003uz1vwwqiposa", "Bilbo");
  const { bindEvt, Members } = usePresenceChannel(
    pusher,
    `presence-clehcjrae0000uz1vmdxyl708` ?? ""
  );
  bindEvt<Members>("pusher:subscription_succeeded", (members) => {
    members.each((member: { id: string; info: { username: string } }) => {
      updateMembers([...membersList, member]);
    });
  });
  bindEvt<Member>("pusher:member_added", (member) => {
    console.log(member);
  });
  bindEvt<User>("player-joined", (player) => {
    // activePlayers.set(player.charName, player);
    utils.user.inRoom.invalidate();
  });
  bindEvt<User>("player-left", (player) => {
    // activePlayers.delete(player.charName);
    utils.user.inRoom.invalidate();
  });

  useEffect(() => {
    pusher.signin();

    // function handleWindowClose(e: Event) {
    //   if (document.visibilityState === "hidden") {
    //     navigator.sendBeacon("/api/logout", `${userId} ${roomId}`);
    //   }
    // }

    // document.addEventListener("visibilitychange", handleWindowClose);
    // window.addEventListener("pagehide", handleWindowClose);

    return () => {
      // document.removeEventListener("visibilitychange", handleWindowClose);
      // window.removeEventListener("pagehide", handleWindowClose);

      dice.forEach((die) => {
        removeDie(die.id);
        die.disconnect();
      });
    };
  }, []);

  useEffect(() => {
    membersList.forEach((member) => {
      console.log(member);
    });
  }, [membersList]);

  if (roomLoading || userLoading) {
    return (
      <div>
        <h1>Joining Room Session...</h1>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between">
        {/* header container */}
        <div className="flex flex-col justify-center">
          <Head>
            <title>
              {room?.name}: {player?.charName}
            </title>
          </Head>
          <h1 className="text-center text-4xl">{room?.name}</h1>
          <h2 className="text-center text-2xl">
            Character Name: {player?.charName}
          </h2>
          <h2 className="text-center text-2xl">
            Player Name: {player?.playerName}
          </h2>
          <ol className="flex flex-col justify-center">
            {player?.dieRolls.map((roll) => (
              <li>{roll.outcome}</li>
            ))}
          </ol>
          {/* die selector */}
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
        {/* player list */}
        <div className="text-center">
          <h3 className="text-3xl underline">Characters</h3>
          {membersList && membersList?.length > 0 && (
            <ol>
              {membersList.map((member) => (
                <li>{member.info.username}</li>
              ))}
            </ol>
          )}
        </div>
      </div>
      {/* table container */}
      <div className="tableTex mx-auto mb-10  min-h-screen  w-11/12 rounded-md md:w-4/5">
        {/* die outcome display */}
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
        {/* dice */}
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
    </div>
  );
};

export default RoomSession;
