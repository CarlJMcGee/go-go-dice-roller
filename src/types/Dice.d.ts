import { DieRoll, Player, User } from "@prisma/client";

export type DiceStyles = "standard" | "genesys";

export type DieRollFull = DieRoll & {
  player: Pick<Player, "charName" | "id" | "playerName">;
};

export type FakeDie = {
  id: string;
  color: FakeDieColors;
  label: string;
};

export type FakeDieColors =
  | "red"
  | "blue"
  | "green"
  | "yellow"
  | "orange"
  | "white";
