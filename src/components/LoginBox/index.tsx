import { Room } from "@prisma/client";
import * as React from "react";
import { useEffect, useState } from "react";
import { trpc } from "../../utils/api";

export interface ILoginBoxProps {}

export default function LoginBox(props: ILoginBoxProps) {
  const utils = trpc.useContext();

  const [roomName, setRoomName] = useState("");
  const [room, setRoom] = useState<Room | undefined>();

  const { mutate: addRoom } = trpc.room.add.useMutation({
    onSuccess(data) {
      setRoom(data);
      utils.room.findRoom.invalidate();
    },
  });
  const {
    data: searchRes,
    isLoading: searchResLoading,
    refetch,
  } = trpc.room.findRoom.useQuery({ search: roomName });

  const addRoomHandler = (e: React.FormEvent) => {
    e.preventDefault();

    addRoom({ name: roomName });
    setRoomName("");
  };

  useEffect(() => {
    console.log(searchRes);
  }, [searchRes]);

  return (
    <div className="m-4">
      <form onSubmit={addRoomHandler}>
        <input
          type="text"
          value={roomName}
          placeholder="Room Name"
          className="bg-gray-200"
          onChange={(e) => {
            setRoomName(e.target.value);
            refetch();
          }}
        />
      </form>
      {searchRes ? searchRes.map((room) => <h3>{room.name}</h3>) : null}
    </div>
  );
}
