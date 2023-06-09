import { trpc } from "../../utils/api";
import { useGenesysResult } from "../../utils/go-dice-genesys-hooks";

interface GenesysResultDisplayProps {
  genesys: ReturnType<typeof useGenesysResult>;
}

export default function GenesysResultDisplay({
  genesys,
}: GenesysResultDisplayProps) {
  const { mutate: sendRoom } = trpc.dieRoll.add.useMutation();

  return (
    <div className="flex justify-center text-center text-4xl text-white">
      {genesys.rolled && (
        <h3>{`${genesys.crit && genesys.crit} ${genesys.outcome} ${
          genesys.sideEffects && `with ${genesys.sideEffects}`
        }`}</h3>
      )}
      {genesys.rolled && (
        <button
          className="rounded-md bg-gray-400 px-2 py-1 hover:bg-gray-600"
          onClick={() => genesys.resetResults()}
        >
          Reset
        </button>
      )}
    </div>
  );
}
