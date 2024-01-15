import { Player } from "@prisma/client";

export type Member = {
  id: string;
  info: Player;
};
