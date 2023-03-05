import { Autocomplete, Input } from "@mantine/core";
import { useForm } from "@mantine/form";
import type { Room, User } from "@prisma/client";
import Link from "next/link";
import * as React from "react";
import { useEffect, useState } from "react";
import { trpc } from "../../utils/api";

export default function LoginBox() {
  const utils = trpc.useContext();

  // state
  const [roomName, setRoomName] = useState("");
  const [room, setRoom] = useState<Room | undefined>();
  const [character, setChar] = useState<User | undefined>();
  const [characters, setCharacters] = useState<User[] | undefined>();

  // queries & mutations
  const { mutate: addRoom } = trpc.room.add.useMutation({
    onSuccess(data) {
      setRoom(data);
      setCharacters(data.players);
      utils.room.findRoom.invalidate();
    },
  });
  const {
    data: searchRes,
    isLoading: searchResLoading,
    refetch: search,
  } = trpc.room.findRoom.useQuery({ search: roomName });
  const { mutate: addCharacter } = trpc.user.add.useMutation({
    onSuccess(data) {
      setChar(data);
    },
  });

  // handlers
  const addRoomHandler = (e: React.FormEvent) => {
    e.preventDefault();

    addRoom({ name: roomName });
  };
  const addCharHandler = (e: React.FormEvent) => {
    e.preventDefault();

    if (!room) {
      return;
    }

    addCharacter({ ...playerForm.values, roomId: room.id });
  };

  // mantine form
  const playerForm = useForm({
    initialValues: {
      playerName: "",
      charName: "",
    },
    validate: {
      playerName: (value) => (value ? null : `Must provide a Player Name`),
      charName: (value) => (value ? null : `Must provide a Character Name`),
    },
  });

  useEffect(() => {
    if (!characters) {
      return;
    }
    playerForm.setFieldValue(
      "playerName",
      characters?.find(
        (player) => player.charName === playerForm.values.charName
      )?.playerName!
    );
  }, [playerForm.values.charName]);

  return (
    <div className="rounded-md bg-slate-400 md:h-1/2 md:w-2/6">
      <h3 className="my-3 mx-3 text-center text-3xl text-white underline">
        Login to Game Session
      </h3>
      <div className="flex flex-col items-center">
        <form
          onSubmit={addRoomHandler}
          className="m-4 flex w-1/2 flex-col justify-center"
        >
          <Autocomplete
            className={`${room ? "border-2 border-green-500" : ""}`}
            type="text"
            value={roomName}
            data={searchRes?.map((room) => room.name) ?? []}
            placeholder="Room Name"
            onChange={(e) => {
              setRoomName(e);
              search();
            }}
          />
          <button
            type="submit"
            className="mt-2 w-1/2 self-center rounded-md bg-teal-500 p-1 text-center hover:bg-teal-300"
          >
            Set Room
          </button>
        </form>
        <form
          className="m-4 flex w-1/2 flex-col justify-center"
          onSubmit={addCharHandler}
        >
          {room ? (
            <Autocomplete
              className={`my-4 ${character ? "border-2 border-green-500" : ""}`}
              type={"text"}
              data={characters?.map((player) => player.charName) ?? [""]}
              placeholder="Character Name"
              {...playerForm.getInputProps("charName")}
            />
          ) : (
            <Autocomplete
              className="my-4"
              disabled
              type={"text"}
              data={[""]}
              placeholder="Character Name"
            />
          )}
          {room ? (
            <Autocomplete
              className={`my-4 ${character ? "border-2 border-green-500" : ""}`}
              type={"text"}
              data={characters?.map((player) => player.playerName) ?? [""]}
              placeholder="Player Name"
              {...playerForm.getInputProps("playerName")}
            />
          ) : (
            <Autocomplete
              className="my-4"
              disabled
              type={"text"}
              data={[""]}
              placeholder="Player Name"
            />
          )}
          <button
            type="submit"
            className="mt-2 w-1/2 self-center rounded-md bg-teal-500 p-1 text-center hover:bg-teal-300"
          >
            Set Character
          </button>
        </form>
        {room && character ? (
          <Link
            href={`/rooms/${room.id}/${character.id}`}
            className="m-3 w-1/2 self-center rounded-md bg-teal-500 p-1 text-center hover:bg-teal-300"
          >
            <button type="button">Enter Room</button>
          </Link>
        ) : null}
      </div>
    </div>
  );
}
