import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

// pusher
import { pusherServer, triggerEvent } from "../../../utils/pusher-store";

export const userRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx: { DB } }) => {
    return await DB.players.findMany({
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
    .query(async ({ ctx: { DB }, input }) => {
      return await DB.players.findMany({
        where: {
          roomId: input.roomId,
          loggedIn: true,
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
    .mutation(async ({ ctx: { DB }, input }) => {
      return await DB.players.upsert({
        where: {
          charName: input.charName,
        },
        create: {
          ...input,
          DBid: DB.id,
        },
        update: {},
      });
    }),
  getOne: publicProcedure
    .input(
      z.object({
        playerId: z.string().optional(),
      })
    )
    .query(async ({ ctx: { DB }, input }) => {
      if (!input.playerId) {
        return null;
      }

      return await DB.players.findFirstOrThrow({
        where: {
          id: input.playerId,
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
  login: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        socket_id: z.string(),
      })
    )
    .mutation(async ({ ctx: { DB }, input }) => {
      const user = await DB.players.update({
        where: {
          id: input.userId,
        },
        data: {
          loggedIn: true,
        },
      });

      const userData = {
        id: user.id,
        user_info: {
          username: user.charName,
        },
      };

      const auth = pusherServer.authenticateUser(input.socket_id, userData);
      await triggerEvent(user.roomId, "player-joined", user);
    }),
  logout: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx: { DB }, input }) => {
      const user = await DB.players.update({
        where: {
          id: input.userId,
        },
        data: {
          loggedIn: false,
        },
      });

      await triggerEvent(user.roomId, "player-left", user);
    }),
});
