import { Room } from "@prisma/client";
import { z } from "zod";

import { publicProcedure, createTRPCRouter } from "../trpc";

export const roomRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.room.findMany({});
  }),
  getOne: publicProcedure
    .input(
      z.object({
        roomId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.room.findUniqueOrThrow({
        where: {
          id: input.roomId,
        },
        include: {
          players: {
            include: {
              dieRolls: true,
            },
          },
          dieRolls: true,
        },
      });
    }),
  add: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const room: Room = await ctx.prisma.room.upsert({
        where: {
          name: input.name,
        },
        create: {
          name: input.name,
        },
        update: {},
      });

      return { msg: `room: ${room.id}` };
    }),
});
