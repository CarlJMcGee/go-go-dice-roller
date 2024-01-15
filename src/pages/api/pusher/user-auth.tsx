import type { NextApiRequest, NextApiResponse } from "next";
import { pusherServer } from "../../../utils/pusher-store";
import { prisma } from "../../../server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      await pusherAuth(req, res);
      break;

    default:
      break;
  }
}

async function pusherAuth(req: NextApiRequest, res: NextApiResponse) {
  const { socket_id } = req.body as { socket_id: string };
  const { userid } = req.headers as {
    userid: string;
  };

  const player = await prisma?.player.findUnique({
    where: {
      id: userid,
    },
  });

  const playerData = {
    id: userid,
    user_info: player,
  };

  const auth = pusherServer.authenticateUser(socket_id, playerData);
  res.status(200).send(auth);
}
