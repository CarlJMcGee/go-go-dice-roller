import type { DieRoll } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { triggerEvent } from "../../../utils/pusher-store";
import dayjs from "dayjs";

export const dieRollRouter = createTRPCRouter({
  /**
   * Retrieves all die rolls from the database.
   *
   * @returns An array of all die roll objects.
   */
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.DB.dieRolls.findMany({});
  }),
  /**
   * Retrieves all die rolls for the specified room, ordered by the most recent first, and includes the player information.
   *
   * @param roomId - The ID of the room to retrieve die rolls for.
   * @returns An array of die roll objects, each containing the player's name, character name, and player ID.
   */
  inRoom: publicProcedure
    .input(
      z.object({
        roomId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.DB.dieRolls.findMany({
        where: {
          roomId: input.roomId,
        },
        orderBy: {
          created: "desc",
        },
        include: {
          player: {
            select: {
              playerName: true,
              charName: true,
              id: true,
            },
          },
        },
      });
    }),
  /**
   * Adds a new die roll to the database and triggers a Pusher event to notify clients.
   *
   * @param outcome - The outcome of the die roll.
   * @param playerId - The ID of the player who rolled the die.
   * @param roomId - The ID of the room where the die roll occurred.
   * @returns An object with a message indicating the outcome of the die roll.
   */
  add: publicProcedure
    .input(
      z.object({
        outcome: z.string(),
        playerId: z.string(),
        roomId: z.string(),
      })
    )
    .mutation(async ({ ctx: { DB }, input }) => {
      await DB.dieRolls.deleteMany({
        where: {
          roomId: input.roomId,
          created: {
            lte: dayjs().subtract(90, "days").toISOString(),
          },
        },
      });

      concatOutcome(input);

      const newRoll: DieRoll = await DB.dieRolls.create({
        data: {
          ...input,
          DBid: DB.id,
        },
        include: {
          player: {
            select: {
              charName: true,
              playerName: true,
              id: true,
            },
          },
        },
      });

      await triggerEvent(`presence-${newRoll.roomId}`, "rolled", newRoll);

      return { msg: `roll of ${newRoll.outcome}` };
    }),
});

/**
 * Concats the outcome string to shorten certain outcome descriptions.
 * @param input - An object containing the room ID, outcome, and player ID.
 * @param input.roomId - The ID of the room where the die roll occurred.
 * @param input.outcome - The outcome of the die roll.
 * @param input.playerId - The ID of the player who rolled the die.
 * @returns void
 */
function concatOutcome(input: {
  roomId: string;
  outcome: string;
  playerId: string;
}) {
  if (input.outcome.includes("Success")) {
    input.outcome = input.outcome.replace("Success", "Succ");
  }
  if (input.outcome.includes("Failure")) {
    input.outcome = input.outcome.replace("Failure", "Fail");
  }
  if (input.outcome.includes("Advantage")) {
    input.outcome = input.outcome.replace("Advantage", "Adv");
  }
  if (input.outcome.includes("Disadvantage")) {
    input.outcome = input.outcome.replace("Disadvantage", "Dis");
  }
  if (input.outcome.includes("Triumphant")) {
    input.outcome = input.outcome.replace("Triumphant", "Trph");
  }
  if (input.outcome.includes("Despairing")) {
    input.outcome = input.outcome.replace("Despairing", "Despr");
  }
}
