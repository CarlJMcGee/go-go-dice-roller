import { NextPage } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect } from "react";
import { trpc } from "../../../../utils/api";

const RoomSession: NextPage = () => {
  // router
  const router = useRouter();
  interface RoomSessParams extends ParsedUrlQuery {
    roomId?: string;
    userId?: string;
  }
  const { roomId, userId }: RoomSessParams = router.query;

  // trpc calls
  const { data: room, isLoading: roomLoading } = trpc.room.getOne.useQuery({
    roomId: roomId ?? "",
  });
  const { data: user, isLoading: userLoading } = trpc.user.getOne.useQuery({
    userId: userId ?? "",
  });

  useEffect(() => {
    console.log(roomId, userId);
  });

  return (
    <div>
      <h1 className="text-center text-4xl">{room?.name}</h1>
      <h2 className="text-center text-2xl">Character Name: {user?.charName}</h2>
      <h2 className="text-center text-2xl">Player Name: {user?.playerName}</h2>
      <ol className="flex flex-col justify-center">
        {user?.dieRolls.map((roll) => (
          <li>{roll.outcome}</li>
        ))}
      </ol>
    </div>
  );
};

export default RoomSession;
