import { DieRoll, User } from "@prisma/client";

export type DiceStyles = "standard" | "genesys";

export type DieRollFull = DieRoll & {
  user: Pick<User, "charName" | "id" | "playerName">;
};
