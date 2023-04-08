import { NextApiRequest, NextApiResponse } from "next";
import { trpc } from "../../../utils/api";
import { pusherServer } from "../../../utils/pusher-store";

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
  const { socket_id } = req.body;
  const { userid } = req.headers as {
    userid: string;
  };

  const user = await prisma?.user.findUnique({
    where: {
      id: userid,
    },
  });

  const userData = {
    id: userid,
    user_info: user,
  };

  const auth = pusherServer.authenticateUser(socket_id, userData);
  res.status(200).send(auth);
}
