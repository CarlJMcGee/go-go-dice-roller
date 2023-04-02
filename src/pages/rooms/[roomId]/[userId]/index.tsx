import { useRouter } from "next/router";
import type { ParsedUrlQuery } from "querystring";
import { useEffect, useState } from "react";
import { trpc } from "../../../../utils/api";
import { useDiceSet } from "../../../../utils/go-dice-react";
import { useGenesysResult } from "../../../../utils/go-dice-genesys-hooks";
import Head from "next/head";
import GenesysDieDisplay from "../../../../components/GenesysDieDisplay";
import type { DiceStyles } from "../../../../types/Dice";
import { User } from "@prisma/client";
import PusherClient from "pusher-js";
import type { Members } from "pusher-js";
import type { Member } from "../../../../types/pusher";
import Link from "next/link";
import StandardDieDisplay from "../../../../components/StandardDieDisplay";

const RoomSession = () => {
  // router
  const router = useRouter();
  type RoomSessParams = ParsedUrlQuery & {
    roomId: string;
    userId: string;
  };
  const { roomId, userId } = router.query as RoomSessParams;

  // state
  const [diceStyle, setDiceStyle] = useState<DiceStyles>("standard");
  const [membersList, updateMembers] = useState<User[]>([]);

  // trpc calls
  const utils = trpc.useContext();
  const { data: room, isLoading: roomLoading } = trpc.room.getOne.useQuery({
    roomId: roomId,
  });
  const { data: player, isLoading: userLoading } = trpc.user.getOne.useQuery(
    {
      userId: userId,
    },
    {
      retry: 3,
      retryDelay: 500,
    }
  );

  // go dice
  const [dice, requestDie, removeDie] = useDiceSet();
  const genesys = useGenesysResult();

  // pusher
  useEffect(() => {
    const pusher = new PusherClient("91fcd24238f218b740dc", {
      cluster: "us2",
      forceTLS: true,
      channelAuthorization: {
        endpoint: "/api/pusher/channel-auth",
        transport: "ajax",
      },
      userAuthentication: {
        endpoint: "/api/pusher/user-auth",
        transport: "ajax",
        headers: { userid: userId },
      },
    });

    pusher.connection.bind("state_change", (states: unknown) => {
      console.log("state: ", states);
    });

    pusher.signin();

    const sub = pusher.subscribe(`presence-${roomId}`);
    sub.bind("pusher:subscription_error", (data: unknown) => {
      console.log(data);
    });
    sub.bind("pusher:subscription_succeeded", (data: Members) => {
      updateMembers([...(Object.values(data.members) satisfies User[])]);
      console.log(data);
    });
    sub.bind("pusher_internal:member_added", (data: Member) => {
      if (membersList.find((user) => user.id === data.id)) {
        return;
      }
      updateMembers((members) => [...members, data.info]);
    });
    sub.bind("pusher_internal:member_removed", (data: Member) => {
      updateMembers((members) => members.filter((user) => user.id !== data.id));
    });

    return () => {
      sub.unsubscribe();
      sub.disconnect();
      pusher.disconnect();
    };
  }, []);

  useEffect(() => {
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
    console.log(dice);
  }, [dice]);

  if (roomLoading || userLoading) {
    return (
      <div>
        <h1>Joining Room Session...</h1>
      </div>
    );
  }

  if (!player || !room) {
    return (
      <div>
        <h1>Error!</h1>
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
              onChange={(e) => setDiceStyle(e.target.value as DiceStyles)}
            >
              <option
                value="standard"
                onChange={(e) =>
                  setDiceStyle(e.currentTarget.value as DiceStyles)
                }
              >
                Standard
              </option>
              <option
                value="genesys"
                onChange={(e) =>
                  setDiceStyle(e.currentTarget.value as DiceStyles)
                }
              >
                Genesys
              </option>
            </select>
          </div>
        </div>
        {/* player list */}
        <div className="text-center">
          <Link href={"/"}>
            <button className="m-3 rounded-md bg-blue-400 px-4 py-1 hover:bg-blue-300">
              Logout
            </button>
          </Link>
          <h3 className="text-3xl underline">Characters</h3>
          <ol>
            {membersList.length > 0 &&
              membersList.map((member: User) => (
                <li key={member.id}>
                  <h3>{member.charName}</h3>
                </li>
              ))}
          </ol>
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
          {dice.map((die, i) =>
            diceStyle === "standard" ? (
              <StandardDieDisplay
                key={die.id}
                die={die}
                index={i}
                removeDie={removeDie}
              />
            ) : diceStyle === "genesys" ? (
              <GenesysDieDisplay
                key={die.id}
                diceSet={diceStyle}
                die={die}
                index={i}
                inputResult={genesys.inputResult}
                setRolled={genesys.setRolled}
                removeDie={removeDie}
              />
            ) : null
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomSession;
