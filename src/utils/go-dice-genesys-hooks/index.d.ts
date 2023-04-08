/// <reference types="react" />
import { Die } from "go-dice-api";
export declare type posDieFaces = "success" | "advantage" | "triumph" | "blank";
export declare type negDieFaces = "failure" | "threat" | "despair" | "blank";
export declare type genDieFaces = "success" | "advantage" | "triumph" | "blank" | "failure" | "threat" | "despair";
export declare type posDieTypes = "proficiency" | "ability" | "boost";
export declare type negDieTypes = "challenge" | "difficulty" | "setback";
export declare type genDieTypes = "proficiency" | "ability" | "boost" | "challenge" | "difficulty" | "setback";
export declare const proficiencyDie: import("@carljmcgee/set-map-plus").IMapPlus<number, genDieFaces[]>;
export declare const abilityDie: import("@carljmcgee/set-map-plus").IMapPlus<number, genDieFaces[]>;
export declare const boostDie: import("@carljmcgee/set-map-plus").IMapPlus<number, genDieFaces[]>;
export declare const challengeDie: import("@carljmcgee/set-map-plus").IMapPlus<number, genDieFaces[]>;
export declare const difficultyDie: import("@carljmcgee/set-map-plus").IMapPlus<number, genDieFaces[]>;
export declare const setbackDie: import("@carljmcgee/set-map-plus").IMapPlus<number, genDieFaces[]>;
export declare function useGenesysDie(die: Die, dieType: genDieTypes): genDieFaces[];
export declare function useGenesysResult(): {
    success: number;
    triumph: number;
    advantage: number;
    rolled: boolean;
    setRolled: React.Dispatch<React.SetStateAction<boolean>>;
    outcome: string;
    sideEffects: string;
    crit: string;
    inputResult: (values: genDieFaces[]) => void;
    resetResults: () => void;
};
//# sourceMappingURL=index.d.ts.map