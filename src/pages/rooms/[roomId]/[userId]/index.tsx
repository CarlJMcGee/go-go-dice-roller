import type { ParsedUrlQuery } from "querystring";
import type { DiceStyles, DieRollFull, FakeDie } from "../../../../types/Dice";
import type { Members } from "pusher-js";
import type { Member } from "../../../../types/pusher";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { trpc } from "../../../../utils/api";
import { useDiceSet } from "../../../../utils/go-dice-react";
import { useGenesysResult } from "../../../../utils/go-dice-genesys-hooks";
import Head from "next/head";
import GenesysDieDisplay from "../../../../components/GenesysDieDisplay";
import { User } from "@prisma/client";
import PusherClient from "pusher-js";
import Link from "next/link";
import StandardDieDisplay from "../../../../components/StandardDieDisplay";
import { ActionIcon, Menu, Select } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import RollsRTCDisplay from "../../../../components/RollsRTCDisplay";
import Dice from "../../../../components/Dice";
import FakeDice from "../../../../components/FakeDice";
import { randomUUID } from "crypto";
import { numBetween } from "@carljmcgee/lol-random";
import GenesysResultDisplay from "../../../../components/GenesysResultDisplay";

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
  const [diceMenu, setDiceMenu] = useState(false);

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

  // fake dice
  const [fakeDice, setFakeDice] = useState<FakeDie[]>([]);
  function removeFakeDie(die: FakeDie) {
    setFakeDice((fakeDice) => fakeDice.filter((d) => d !== die));
  }

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
    sub.bind(
      "pusher:subscription_succeeded",
      (data: { members: { [s: string]: User } }) => {
        updateMembers([...Object.values(data.members)]);
      }
    );
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

  useEffect(() => {
    console.log(diceMenu);
  }, [diceMenu]);

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
    <div className="w-full bg-[#ffeecb]">
      <div className="flex justify-between">
        {/* header container */}
        <div className="m-2 flex flex-col justify-center">
          <Head>
            <title>
              {room?.name}: {player?.charName}
            </title>
          </Head>
          <h1 className="text-center text-4xl text-[#2f4858]">{room?.name}</h1>
          <h2 className="text-center text-2xl text-[#2f4858]">
            Character Name: {player?.charName}
          </h2>
          <h2 className="text-center text-2xl text-[#2f4858]">
            Player Name: {player?.playerName}
          </h2>
        </div>
        {/* player list */}
        <div className="m-2 text-center text-[#2f4858]">
          <Link href={"/"}>
            <button className="m-3 rounded-md bg-red-400 px-4 py-1 text-[#dfe0df] hover:bg-red-300 hover:text-[#402e32]">
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
        {/* party rolls RTC */}
        <RollsRTCDisplay rolls={partyRolls} />
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
          <GenesysResultDisplay genesys={genesys} />
          {/* <div className="flex justify-center text-center text-4xl text-white">
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
          </div> */}
          {/* dice */}
          <div className="grid grid-cols-1 items-start md:grid-cols-2">
            {/* real dice */}
            {dice.map((die, i) => (
              <Dice
                key={die.id}
                diceStyle={diceStyle}
                die={die}
                index={i}
                userId={userId}
                roomId={roomId}
                inputResult={genesys.inputResult}
                removeDie={removeDie}
                setRolled={genesys.setRolled}
              />
            ))}
            {/* fake dice */}
            {fakeDice.map((die, i) => (
              <FakeDice
                key={die.id}
                die={die}
                index={i}
                inputResult={genesys.inputResult}
                setRolled={genesys.setRolled}
                diceStyle={diceStyle}
                removeDie={removeFakeDie}
                sess={[roomId, userId]}
              />
            ))}
            {/* add die button  */}
            <ActionIcon
              size={"xl"}
              className="m-1 flex h-52 w-52 flex-col justify-center justify-self-center border-4 bg-slate-300 p-3"
            >
              <IconPlus
                size={"100%"}
                onClick={() => setDiceMenu((value) => !value)}
              />
              <Menu
                opened={diceMenu}
                onChange={setDiceMenu}
                closeOnClickOutside={true}
                closeOnItemClick={true}
                width={"100%"}
                transition={"pop"}
              >
                <Menu.Dropdown>
                  <Menu.Label>Add Die</Menu.Label>
                  <Menu.Item
                    onClick={() => {
                      setDiceMenu((value) => !value);
                      requestDie();
                    }}
                  >
                    GoDice
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => {
                      setDiceMenu((value) => !value);
                      setFakeDice((dice) => [
                        ...dice,
                        {
                          id: numBetween(1, 999999).toString(),
                          color: "white",
                          label: "new die",
                        },
                      ]);
                    }}
                  >
                    Digital Die
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </ActionIcon>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomSession;
