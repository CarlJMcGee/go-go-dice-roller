import { DieRoll } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const dieRollRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.dieRoll.findMany({});
  }),
  inRoom: publicProcedure
    .input(
      z.object({
        roomId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.dieRoll.findMany({
        where: {
          roomId: input.roomId,
        },
        include: {
          user: {
            select: {
              playerName: true,
              charName: true,
              id: true,
            },
          },
        },
      });
    }),
  add: publicProcedure
    .input(
      z.object({
        outcome: z.string(),
        userId: z.string(),
        roomId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const roll: DieRoll = await ctx.prisma.dieRoll.create({
        data: {
          ...input,
        },
      });

      return { msg: `roll of ${roll.outcome}` };
    }),
});
