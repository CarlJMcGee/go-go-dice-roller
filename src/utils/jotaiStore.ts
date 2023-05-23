import {atom} from "jotai"
import { Die } from "./go-dice-api"
import { useGenesysResult } from "./go-dice-genesys-hooks"
import { useDiceSet } from "./go-dice-react"

export const DiceSetAtom = atom<[dice: Die[], requestDie: () => void, removeDie: (dieId: string) => void] | null>(null)
export const GenesysUtilsAtom = atom<ReturnType<typeof useGenesysResult> | null>(null)