import type { NextApiRequest, NextApiResponse } from "next";
import { pusherServer } from "../../../utils/pusher-store";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST":
      pusherAuth(req, res);
      break;

    default:
      break;
  }
}

function pusherAuth(req: NextApiRequest, res: NextApiResponse) {
  const { socket_id, channel_name } = req.body as {
    socket_id: string;
    channel_name: string;
  };

  try {
    const auth = pusherServer.authorizeChannel(socket_id, channel_name);
    res.status(200).send(auth);
  } catch (err) {
    if (err) console.error(err);
  }
}
