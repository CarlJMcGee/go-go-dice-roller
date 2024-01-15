import type { DieRoll } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { triggerEvent } from "../../../utils/pusher-store";
import dayjs from "dayjs";

export const dieRollRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.DB.dieRolls.findMany({});
  }),
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
