import { DieRoll, Room, User } from "@prisma/client";

export type UserFull = User & {
  room: Room & {
    players: {
      playerName: string;
      charName: string;
    }[];
  };
  dieRolls: DieRoll[];
};

export type UsersActive = (User & {
  room: Room;
  dieRolls: DieRoll[];
})[];
