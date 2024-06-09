import { z } from "zod";

import { publicProcedure, createTRPCRouter } from "../trpc";

export const roomRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.DB.rooms.findMany({});
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

      return await ctx.DB.rooms.findUniqueOrThrow({
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
              player: {
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
      return await ctx.DB.rooms.upsert({
        where: {
          name: input.name,
        },
        create: {
          name: input.name,
          DBid: ctx.DB.id,
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
      return ctx.DB.rooms.findMany({
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
