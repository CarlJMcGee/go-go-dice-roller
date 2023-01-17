import { User } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany({
      orderBy: {
        charName: "asc",
      },
      include: {
        dieRolls: true,
        room: true,
      },
    });
  }),
  inRoom: publicProcedure
    .input(
      z.object({
        roomId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.user.findMany({
        where: {
          roomId: input.roomId,
        },
        orderBy: {
          charName: "asc",
        },
        include: {
          dieRolls: true,
          room: true,
        },
      });
    }),
  add: publicProcedure
    .input(
      z.object({
        playerName: z.string(),
        charName: z.string(),
        roomId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user.upsert({
        where: {
          charName: input.charName,
        },
        create: {
          ...input,
        },
        update: {},
      });
    }),
  getOne: publicProcedure
    .input(
      z.object({
        charName: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.user.findFirstOrThrow({
        where: {
          charName: input.charName,
        },
        include: {
          room: {
            include: {
              players: {
                select: {
                  charName: true,
                  playerName: true,
                },
              },
            },
          },
          dieRolls: true,
        },
      });
    }),
});
