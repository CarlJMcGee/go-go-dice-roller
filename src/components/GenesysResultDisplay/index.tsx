import { useEffect, useState } from "react";
import { trpc } from "../../utils/api";
import type { useGenesysResult } from "../../utils/go-dice-genesys-hooks";

interface GenesysResultDisplayProps {
  genesys: ReturnType<typeof useGenesysResult>;
  roomId: string;
  userId: string;
}

export default function GenesysResultDisplay({
  genesys,
  roomId,
  userId,
}: GenesysResultDisplayProps) {
  const { mutate: sendRoom } = trpc.dieRoll.add.useMutation();
  const [timerFlag, setTimerFlag] = useState(false);

  useEffect(() => {
    if (!timerFlag) return;

    setTimeout(() => {
      genesys.resetResults();
      setTimerFlag(false);
    }, 30 * 1000);
  }, [timerFlag]);

  return (
    <div className="flex items-center justify-center text-center text-4xl text-white">
      {genesys.rolled && (
        <button
          className="mx-2 rounded-md bg-green-400 px-3 py-3 text-base hover:bg-green-600"
          onClick={() => {
            sendRoom({
              outcome: [
                genesys.crit,
                genesys.outcome,
                genesys.sideEffects,
              ].join(" "),
              roomId: roomId,
              userId: userId,
            });

            setTimerFlag(true);
          }}
        >
          Send
        </button>
      )}
      {genesys.rolled && (
        <h3 className="w-min">{`${genesys.crit && genesys.crit} ${
          genesys.outcome
        } ${genesys.sideEffects && `with ${genesys.sideEffects}`}`}</h3>
      )}
      {genesys.rolled && (
        <button
          className="mx-2 rounded-md bg-red-400  px-1 py-1 text-base hover:bg-red-600"
          onClick={() => genesys.resetResults()}
        >
          Reset
        </button>
      )}
    </div>
  );
}
