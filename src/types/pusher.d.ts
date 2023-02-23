import { User } from "@prisma/client";

export type Member = {
  id: string;
  info: User;
};
