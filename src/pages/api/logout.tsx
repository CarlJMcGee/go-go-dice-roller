import { NextApiRequest, NextApiResponse } from "next";
import { triggerEvent } from "../../utils/pusher-store";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    console.log(req.body);
    if (req.body) {
      const [userId, roomId] = req.body.split(" ");
      const user = await prisma?.user.update({
        where: {
          id: userId,
        },
        data: {
          loggedIn: false,
        },
      });

      triggerEvent(roomId, "player-left", user);
    }

    res.status(200).send("good-bye");
  }
}
