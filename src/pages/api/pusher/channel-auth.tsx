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

/**
 * Authorizes a Pusher channel for the given socket ID and channel name.
 *
 * @param req - The NextJS API request object.
 * @param res - The NextJS API response object.
 * @returns The Pusher channel authorization response.
 */
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
