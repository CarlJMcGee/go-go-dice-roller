import { NextApiRequest, NextApiResponse } from "next";
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
  const { socket_id, userId, username } = req.body;

  const userData = {
    id: userId,
    user_info: {
      username: username,
    },
  };

  const auth = pusherServer.authenticateUser(socket_id, userData);
  res.status(200).send(auth);
}
