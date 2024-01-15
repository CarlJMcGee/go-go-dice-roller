import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import type { Player, DieRoll, Room } from "@prisma/client";
import { error } from "console";

export const DbRouter = createTRPCRouter({
  export: publicProcedure
    .input(
      z.object({
        password: z.string(),
      })
    )
    .mutation(async ({ ctx: { DB }, input: { password } }) => {
      if (password !== "&D57c6895^HYbi6E") {
        return new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid password",
        });
      }

      try {
        const users = await DB.players.findMany({});
        const rooms = await DB.rooms.findMany({});
        const dieRolls = await DB.dieRolls.findMany({});

        return {
          players: users,
          rooms: rooms,
          dieRolls: dieRolls,
        };
      } catch (err) {
        return new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to export data",
        });
      }
    }),
  import: publicProcedure
    .input(
      z.object({
        players: z.custom<Player>().array().optional(),
        rooms: z.custom<Room>().array().optional(),
        dieRolls: z.custom<DieRoll>().array().optional(),
        password: z.string(),
      })
    )
    .mutation(
      async ({
        ctx: { DB },
        input: { password, players, rooms, dieRolls },
      }) => {
        if (password !== "&D57c6895^HYbi6E") {
          return new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid password",
          });
        }

        try {
          await addPlayers(players ?? []);
          await addRooms(rooms ?? []);
          await addDieRolls(dieRolls ?? []);

          async function addPlayers(players: Player[]) {
            players.forEach(async (player) => {
              await DB.players.upsert({
                where: {
                  charName: player.charName,
                },
                create: { ...player, DBid: DB.id },
                update: {},
              });
            });
          }

          async function addRooms(rooms: Room[]) {
            rooms.forEach(async (room) => {
              await DB.rooms.upsert({
                where: {
                  id: room.id,
                },
                create: { ...room, DBid: DB.id },
                update: {},
              });
            });
          }

          async function addDieRolls(dieRolls: DieRoll[]) {
            dieRolls.forEach(async (dieRoll) => {
              const createdDate = new Date(dieRoll.created);
              if (createdDate <= new Date("2023-10-30")) return;

              await DB.dieRolls.upsert({
                where: {
                  id: dieRoll.id,
                },
                create: { ...dieRoll, DBid: DB.id },
                update: {},
              });
            });
          }
        } catch (err) {
          return new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to import data",
          });
        }
      }
    ),
});
