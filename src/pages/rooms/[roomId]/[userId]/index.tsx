import { useRouter } from "next/router";
import type { ParsedUrlQuery } from "querystring";
import { useEffect, useState } from "react";
import { trpc } from "../../../../utils/api";
import { useDiceSet } from "../../../../utils/go-dice-react";
import { useGenesysResult } from "../../../../utils/go-dice-genesys-hooks";
import Head from "next/head";
import GenesysDieDisplay from "../../../../components/GenesysDieDisplay";
import type { DiceStyles, DieRollFull } from "../../../../types/Dice";
import { User } from "@prisma/client";
import PusherClient from "pusher-js";
import type { Members } from "pusher-js";
import type { Member } from "../../../../types/pusher";
import Link from "next/link";
import StandardDieDisplay from "../../../../components/StandardDieDisplay";
import { ActionIcon, ScrollArea, Select, Spoiler } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import moment from "moment";

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
  const [partyRolls, setPartyRolls] = useState<DieRollFull[]>([]);

  // trpc calls
  const utils = trpc.useContext();
  const { data: room, isLoading: roomLoading } = trpc.room.getOne.useQuery(
    {
      roomId: roomId,
    },
    {
      onSuccess(data) {
        if (!data?.dieRolls) {
          return;
        }

        setPartyRolls(data?.dieRolls);
      },
    }
  );
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

    pusher.signin();

    const sub = pusher.subscribe(`presence-${roomId}`);
    sub.bind("pusher:subscription_error", (data: unknown) => {
      console.log(data);
    });
    sub.bind("pusher:subscription_succeeded", (data: Members) => {
      updateMembers([...(Object.values(data.members) satisfies User[])]);
    });
    sub.bind("pusher:member_added", (data: Member) => {
      if (membersList.find((user) => user.id === data.id)) {
        return;
      }
      updateMembers((members) => [...members, data.info]);
    });
    sub.bind("pusher:member_removed", (data: Member) => {
      updateMembers((members) => members.filter((user) => user.id !== data.id));
    });

    sub.bind("rolled", (roll: DieRollFull) => {
      setPartyRolls((partyRolls) => [roll, ...partyRolls]);
    });

    return () => {
      sub.unsubscribe();
      sub.disconnect();
      pusher.disconnect();
    };
  }, []);

  useEffect(() => {
    return () => {
      dice.forEach((die) => {
        removeDie(die.id);
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
        </div>
        {/* player list */}
        <div className="text-center">
          <Link href={"/"}>
            <button className="m-3 rounded-md bg-red-400 px-4 py-1 hover:bg-red-300">
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
      <div className="tableTex mx-auto mb-10 flex min-h-screen w-11/12 flex-col  items-center rounded-md md:flex md:w-4/5 md:flex-row md:items-start md:justify-center">
        {/* party rolls */}
        <div className="my-3 mr-3 w-1/2 bg-gray-400 bg-opacity-75 text-center text-white md:w-1/3">
          <h3 className="text-4xl underline">Party Rolls</h3>
          <ScrollArea h={250} type="always">
            <ul className="pl-5 pt-2 text-left">
              {partyRolls.length > 0 &&
                partyRolls.map((roll) => (
                  <li key={roll.id}>
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
                    <span className="text-xs">
                      ({moment(roll.created).fromNow()})
                    </span>
                  </li>
                ))}
            </ul>
          </ScrollArea>
        </div>
        <div>
          {/* die selector */}
          <div className=" flex justify-center p-2">
            <Select
              variant="filled"
              value={diceStyle}
              data={[
                { value: "standard", label: "Standard" },
                { value: "genesys", label: "Genesys" },
              ]}
              onChange={(value) =>
                setDiceStyle((value as DiceStyles) ?? "standard")
              }
            />
          </div>
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
          <div className="grid grid-cols-1 items-start md:grid-cols-2">
            {dice.map((die, i) =>
              diceStyle === "standard" ? (
                <StandardDieDisplay
                  key={die.id}
                  die={die}
                  index={i}
                  userId={userId}
                  roomId={roomId}
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
            <ActionIcon
              size={"xl"}
              className="m-1 flex h-52 w-52 flex-col justify-center justify-self-center border-4 bg-slate-300 p-3"
              onClick={() => requestDie()}
            >
              <IconPlus size={"100%"} />
            </ActionIcon>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomSession;
