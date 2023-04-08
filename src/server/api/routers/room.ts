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
        roomId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!input.roomId) {
        return null;
      }

      return await ctx.prisma.room.findUniqueOrThrow({
        where: {
          id: input.roomId,
        },
        include: {
          players: {
            include: {
              dieRolls: {
                orderBy: { created: "desc" },
              },
            },
          },
          dieRolls: {
            orderBy: { created: "desc" },
            include: {
              user: {
                select: {
                  charName: true,
                  playerName: true,
                  id: true,
                },
              },
            },
          },
        },
      });
    }),
  add: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.room.upsert({
        where: {
          name: input.name,
        },
        create: {
          name: input.name,
        },
        update: {},
        include: {
          players: true,
        },
      });
    }),
  findRoom: publicProcedure
    .input(
      z.object({
        search: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.room.findMany({
        where: {
          name: {
            startsWith: input.search,
          },
        },
        include: {
          players: true,
        },
      });
    }),
});
