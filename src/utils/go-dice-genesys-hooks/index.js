import { useEffect, useState } from "react";
import { MapPlus } from "@carljmcgee/set-map-plus";
export const proficiencyDie = MapPlus([
  [1, ["blank"]],
  [2, ["success"]],
  [3, ["advantage", "advantage"]],
  [4, ["advantage", "success"]],
  [5, ["advantage"]],
  [6, ["success", "success"]],
  [7, ["success"]],
  [8, ["success", "success"]],
  [9, ["advantage", "success"]],
  [10, ["advantage", "success"]],
  [11, ["advantage", "advantage"]],
  [12, ["triumph"]],
]);
export const abilityDie = MapPlus([
  [1, ["blank"]],
  [2, ["advantage", "success"]],
  [3, ["advantage"]],
  [4, ["advantage", "advantage"]],
  [5, ["success"]],
  [6, ["success", "success"]],
  [7, ["advantage"]],
  [8, ["success"]],
]);
export const boostDie = MapPlus([
  [1, ["blank"]],
  [2, ["success"]],
  [3, ["advantage", "advantage"]],
  [4, ["advantage", "success"]],
  [5, ["advantage"]],
  [6, ["blank"]],
]);
export const challengeDie = MapPlus([
  [1, ["despair"]],
  [2, ["failure"]],
  [3, ["threat", "threat"]],
  [4, ["threat", "failure"]],
  [5, ["failure", "failure"]],
  [6, ["threat"]],
  [7, ["failure"]],
  [8, ["threat"]],
  [9, ["failure", "failure"]],
  [10, ["threat", "failure"]],
  [11, ["threat", "threat"]],
  [12, ["blank"]],
]);
export const difficultyDie = MapPlus([
  [1, ["failure"]],
  [2, ["threat"]],
  [3, ["failure", "threat"]],
  [4, ["threat"]],
  [5, ["blank"]],
  [6, ["threat", "threat"]],
  [7, ["threat"]],
  [8, ["failure", "failure"]],
]);
export const setbackDie = MapPlus([
  [1, ["blank"]],
  [2, ["failure"]],
  [3, ["threat"]],
  [4, ["threat"]],
  [5, ["failure"]],
  [6, ["blank"]],
]);
function proficiencyDieValue(value) {
  const roll = proficiencyDie.get(Number.parseInt(value));
  if (!roll) return ["blank"];
  return roll;
}
function abilityDieValue(value) {
  const roll = abilityDie.get(Number.parseInt(value));
  if (!roll) return ["blank"];
  return roll;
}
function boostDieValue(value) {
  const roll = boostDie.get(Number.parseInt(value));
  if (!roll) return ["blank"];
  return roll;
}
function challengeDieValue(value) {
  const roll = challengeDie.get(Number.parseInt(value));
  if (!roll) return ["blank"];
  return roll;
}
function difficultyDieValue(value) {
  const roll = difficultyDie.get(Number.parseInt(value));
  if (!roll) return ["blank"];
  return roll;
}
function setbackDieValue(value) {
  const roll = setbackDie.get(Number.parseInt(value));
  if (!roll) return ["blank"];
  return roll;
}
const GenValueMap = MapPlus([
  ["proficiency", proficiencyDieValue],
  ["ability", abilityDieValue],
  ["boost", boostDieValue],
  ["challenge", challengeDieValue],
  ["difficulty", difficultyDieValue],
  ["setback", setbackDieValue],
]);
export function useGenesysDie(die, dieType) {
  const [value, setValue] = useState();
  const [genValue, setGenValue] = useState();
  useEffect(() => {
    const onValue = (value) => setValue(value);
    die.on("value", onValue);
    setGenValue(GenValueMap.get(dieType)(value));
    return () => die.off("value", onValue);
  }, [value]);
  return genValue;
}
export function useGenesysResult() {
  const [triumph, setTriumph] = useState(0);
  const [success, setSuccess] = useState(0);
  const [advantage, setAdvantage] = useState(0);
  const [rolled, setRolled] = useState(false);
  const [outcome, setOutcome] = useState("");
  const [sideEffects, setSideEffects] = useState("");
  const [crit, setCrit] = useState("");
  useEffect(() => {
    setOutcome(success > 0 ? "Success" : "Failure");
    setSideEffects(
      advantage > 0 ? "Advantage!" : advantage < 0 ? "Disadvantage!" : ""
    );
    setCrit(triumph > 0 ? "Triumphant" : triumph < 0 ? "Despairing" : "");
  }, [success, advantage, triumph]);
  function inputResult(values) {
    values.forEach((value) => {
      switch (value) {
        case "success":
          setSuccess((prev) => prev + 1);
          break;
        case "advantage":
          setAdvantage((prev) => prev + 1);
          break;
        case "triumph":
          setSuccess((prev) => prev + 1);
          setTriumph((prev) => prev + 1);
          break;
        case "failure":
          setSuccess((prev) => prev - 1);
          break;
        case "threat":
          setAdvantage((prev) => prev - 1);
          break;
        case "despair":
          setSuccess((prev) => prev - 1);
          setTriumph((prev) => prev - 1);
          break;
        case "blank":
          break;
      }
    });
  }
  function resetResults() {
    setSuccess(0);
    setAdvantage(0);
    setTriumph(0);
    setOutcome("");
    setSideEffects("");
    setCrit("");
    setRolled(false);
  }
  return {
    success: success,
    triumph: triumph,
    advantage: advantage,
    rolled: rolled,
    setRolled: setRolled,
    outcome: outcome,
    sideEffects: sideEffects,
    crit: crit,
    inputResult: inputResult,
    resetResults: resetResults,
  };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSxPQUFPLENBQUM7QUFFNUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBeUJuRCxNQUFNLENBQUMsTUFBTSxjQUFjLEdBQUcsT0FBTyxDQUF3QjtJQUMzRCxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2QsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNoQixDQUFDLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUMvQixDQUFDLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUM3QixDQUFDLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ2xCLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQzNCLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDaEIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDM0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDN0IsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDOUIsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDaEMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQztDQUNsQixDQUFDLENBQUM7QUFFSCxNQUFNLENBQUMsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUF3QjtJQUN2RCxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2QsQ0FB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LEtBQUssU0FBUztvQkFDWixVQUFVLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDL0IsVUFBVSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQy9CLE1BQU07Z0JBQ1IsS0FBSyxPQUFPO29CQUNWLE1BQU07YUFDVDtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELFNBQVMsWUFBWTtRQUNuQixVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDZCxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEIsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2QsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2YsY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ25CLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNaLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNuQixDQUFDO0lBRUQsT0FBTztRQUNMLE9BQU8sRUFBRSxPQUFPO1FBQ2hCLE9BQU8sRUFBRSxPQUFPO1FBQ2hCLFNBQVMsRUFBRSxTQUFTO1FBQ3BCLE1BQU0sRUFBRSxNQUFNO1FBQ2QsU0FBUyxFQUFFLFNBQVM7UUFDcEIsT0FBTyxFQUFFLE9BQU87UUFDaEIsV0FBVyxFQUFFLFdBQVc7UUFDeEIsSUFBSSxFQUFFLElBQUk7UUFDVixXQUFXLEVBQUUsV0FBVztRQUN4QixZQUFZLEVBQUUsWUFBWTtLQUMzQixDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHsgRGllIH0gZnJvbSBcImdvLWRpY2UtYXBpXCI7XHJcbmltcG9ydCB7IE1hcFBsdXMgfSBmcm9tIFwiQGNhcmxqbWNnZWUvc2V0LW1hcC1wbHVzXCI7XHJcblxyXG5leHBvcnQgdHlwZSBwb3NEaWVGYWNlcyA9IFwic3VjY2Vzc1wiIHwgXCJhZHZhbnRhZ2VcIiB8IFwidHJpdW1waFwiIHwgXCJibGFua1wiO1xyXG5leHBvcnQgdHlwZSBuZWdEaWVGYWNlcyA9IFwiZmFpbHVyZVwiIHwgXCJ0aHJlYXRcIiB8IFwiZGVzcGFpclwiIHwgXCJibGFua1wiO1xyXG5leHBvcnQgdHlwZSBnZW5EaWVGYWNlcyA9XHJcbiAgfCBcInN1Y2Nlc3NcIlxyXG4gIHwgXCJhZHZhbnRhZ2VcIlxyXG4gIHwgXCJ0cml1bXBoXCJcclxuICB8IFwiYmxhbmtcIlxyXG4gIHwgXCJmYWlsdXJlXCJcclxuICB8IFwidGhyZWF0XCJcclxuICB8IFwiZGVzcGFpclwiO1xyXG5cclxuZXhwb3J0IHR5cGUgcG9zRGllVHlwZXMgPSBcInByb2ZpY2llbmN5XCIgfCBcImFiaWxpdHlcIiB8IFwiYm9vc3RcIjtcclxuXHJcbmV4cG9ydCB0eXBlIG5lZ0RpZVR5cGVzID0gXCJjaGFsbGVuZ2VcIiB8IFwiZGlmZmljdWx0eVwiIHwgXCJzZXRiYWNrXCI7XHJcblxyXG5leHBvcnQgdHlwZSBnZW5EaWVUeXBlcyA9XHJcbiAgfCBcInByb2ZpY2llbmN5XCJcclxuICB8IFwiYWJpbGl0eVwiXHJcbiAgfCBcImJvb3N0XCJcclxuICB8IFwiY2hhbGxlbmdlXCJcclxuICB8IFwiZGlmZmljdWx0eVwiXHJcbiAgfCBcInNldGJhY2tcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBwcm9maWNpZW5jeURpZSA9IE1hcFBsdXM8bnVtYmVyLCBnZW5EaWVGYWNlc1tdPihbXHJcbiAgWzEsIFtcImJsYW5rXCJdXSxcclxuICBbMiwgW1wic3VjY2Vzc1wiXV0sXHJcbiAgWzMsIFtcImFkdmFudGFnZVwiLCBcImFkdmFudGFnZVwiXV0sXHJcbiAgWzQsIFtcImFkdmFudGFnZVwiLCBcInN1Y2Nlc3NcIl1dLFxyXG4gIFs1LCBbXCJhZHZhbnRhZ2VcIl1dLFxyXG4gIFs2LCBbXCJzdWNjZXNzXCIsIFwic3VjY2Vzc1wiXV0sXHJcbiAgWzcsIFtcInN1Y2Nlc3NcIl1dLFxyXG4gIFs4LCBbXCJzdWNjZXNzXCIsIFwic3VjY2Vzc1wiXV0sXHJcbiAgWzksIFtcImFkdmFudGFnZVwiLCBcInN1Y2Nlc3NcIl1dLFxyXG4gIFsxMCwgW1wiYWR2YW50YWdlXCIsIFwic3VjY2Vzc1wiXV0sXHJcbiAgWzExLCBbXCJhZHZhbnRhZ2VcIiwgXCJhZHZhbnRhZ2VcIl1dLFxyXG4gIFsxMiwgW1widHJpdW1waFwiXV0sXHJcbl0pO1xyXG5cclxuZXhwb3J0IGNvbnN0IGFiaWxpdHlEaWUgPSBNYXBQbHVzPG51bWJlciwgZ2VuRGllRmFjZXNbXT4oW1xyXG4gIFsxLCBbXCJibGFua1wiXV0sXHJcbiAgWzIsIFtcImFkdmFudGFnZVwiLCBcInN1Y2Nlc3NcIl1dLFxyXG4gIFszLCBbXCJhZHZhbnRhZ2VcIl1dLFxyXG4gIFs0LCBbXCJhZHZhbnRhZ2VcIiwgXCJhZHZhbnRhZ2VcIl1dLFxyXG4gIFs1LCBbXCJzdWNjZXNzXCJdXSxcclxuICBbNiwgW1wic3VjY2Vzc1wiLCBcInN1Y2Nlc3NcIl1dLFxyXG4gIFs3LCBbXCJhZHZhbnRhZ2VcIl1dLFxyXG4gIFs4LCBbXCJzdWNjZXNzXCJdXSxcclxuXSk7XHJcblxyXG5leHBvcnQgY29uc3QgYm9vc3REaWUgPSBNYXBQbHVzPG51bWJlciwgZ2VuRGllRmFjZXNbXT4oW1xyXG4gIFsxLCBbXCJibGFua1wiXV0sXHJcbiAgWzIsIFtcInN1Y2Nlc3NcIl1dLFxyXG4gIFszLCBbXCJhZHZhbnRhZ2VcIiwgXCJhZHZhbnRhZ2VcIl1dLFxyXG4gIFs0LCBbXCJhZHZhbnRhZ2VcIiwgXCJzdWNjZXNzXCJdXSxcclxuICBbNSwgW1wiYWR2YW50YWdlXCJdXSxcclxuICBbNiwgW1wiYmxhbmtcIl1dLFxyXG5dKTtcclxuXHJcbmV4cG9ydCBjb25zdCBjaGFsbGVuZ2VEaWUgPSBNYXBQbHVzPG51bWJlciwgZ2VuRGllRmFjZXNbXT4oW1xyXG4gIFsxLCBbXCJkZXNwYWlyXCJdXSxcclxuICBbMiwgW1wiZmFpbHVyZVwiXV0sXHJcbiAgWzMsIFtcInRocmVhdFwiLCBcInRocmVhdFwiXV0sXHJcbiAgWzQsIFtcInRocmVhdFwiLCBcImZhaWx1cmVcIl1dLFxyXG4gIFs1LCBbXCJmYWlsdXJlXCIsIFwiZmFpbHVyZVwiXV0sXHJcbiAgWzYsIFtcInRocmVhdFwiXV0sXHJcbiAgWzcsIFtcImZhaWx1cmVcIl1dLFxyXG4gIFs4LCBbXCJ0aHJlYXRcIl1dLFxyXG4gIFs5LCBbXCJmYWlsdXJlXCIsIFwiZmFpbHVyZVwiXV0sXHJcbiAgWzEwLCBbXCJ0aHJlYXRcIiwgXCJmYWlsdXJlXCJdXSxcclxuICBbMTEsIFtcInRocmVhdFwiLCBcInRocmVhdFwiXV0sXHJcbiAgWzEyLCBbXCJibGFua1wiXV0sXHJcbl0pO1xyXG5cclxuZXhwb3J0IGNvbnN0IGRpZmZpY3VsdHlEaWUgPSBNYXBQbHVzPG51bWJlciwgZ2VuRGllRmFjZXNbXT4oW1xyXG4gIFsxLCBbXCJmYWlsdXJlXCJdXSxcclxuICBbMiwgW1widGhyZWF0XCJdXSxcclxuICBbMywgW1wiZmFpbHVyZVwiLCBcInRocmVhdFwiXV0sXHJcbiAgWzQsIFtcInRocmVhdFwiXV0sXHJcbiAgWzUsIFtcImJsYW5rXCJdXSxcclxuICBbNiwgW1widGhyZWF0XCIsIFwidGhyZWF0XCJdXSxcclxuICBbNywgW1widGhyZWF0XCJdXSxcclxuICBbOCwgW1wiZmFpbHVyZVwiLCBcImZhaWx1cmVcIl1dLFxyXG5dKTtcclxuXHJcbmV4cG9ydCBjb25zdCBzZXRiYWNrRGllID0gTWFwUGx1czxudW1iZXIsIGdlbkRpZUZhY2VzW10+KFtcclxuICBbMSwgW1wiYmxhbmtcIl1dLFxyXG4gIFsyLCBbXCJmYWlsdXJlXCJdXSxcclxuICBbMywgW1widGhyZWF0XCJdXSxcclxuICBbNCwgW1widGhyZWF0XCJdXSxcclxuICBbNSwgW1wiZmFpbHVyZVwiXV0sXHJcbiAgWzYsIFtcImJsYW5rXCJdXSxcclxuXSk7XHJcblxyXG5mdW5jdGlvbiBwcm9maWNpZW5jeURpZVZhbHVlKHZhbHVlOiBzdHJpbmcpOiBnZW5EaWVGYWNlc1tdIHtcclxuICBjb25zdCByb2xsID0gcHJvZmljaWVuY3lEaWUuZ2V0KE51bWJlci5wYXJzZUludCh2YWx1ZSkpO1xyXG4gIGlmICghcm9sbCkgcmV0dXJuIFtcImJsYW5rXCJdO1xyXG4gIHJldHVybiByb2xsO1xyXG59XHJcblxyXG5mdW5jdGlvbiBhYmlsaXR5RGllVmFsdWUodmFsdWU6IHN0cmluZyk6IGdlbkRpZUZhY2VzW10ge1xyXG4gIGNvbnN0IHJvbGwgPSBhYmlsaXR5RGllLmdldChOdW1iZXIucGFyc2VJbnQodmFsdWUpKTtcclxuICBpZiAoIXJvbGwpIHJldHVybiBbXCJibGFua1wiXTtcclxuICByZXR1cm4gcm9sbDtcclxufVxyXG5cclxuZnVuY3Rpb24gYm9vc3REaWVWYWx1ZSh2YWx1ZTogc3RyaW5nKTogZ2VuRGllRmFjZXNbXSB7XHJcbiAgY29uc3Qgcm9sbCA9IGJvb3N0RGllLmdldChOdW1iZXIucGFyc2VJbnQodmFsdWUpKTtcclxuICBpZiAoIXJvbGwpIHJldHVybiBbXCJibGFua1wiXTtcclxuICByZXR1cm4gcm9sbDtcclxufVxyXG5cclxuZnVuY3Rpb24gY2hhbGxlbmdlRGllVmFsdWUodmFsdWU6IHN0cmluZyk6IGdlbkRpZUZhY2VzW10ge1xyXG4gIGNvbnN0IHJvbGwgPSBjaGFsbGVuZ2VEaWUuZ2V0KE51bWJlci5wYXJzZUludCh2YWx1ZSkpO1xyXG4gIGlmICghcm9sbCkgcmV0dXJuIFtcImJsYW5rXCJdO1xyXG4gIHJldHVybiByb2xsO1xyXG59XHJcbmZ1bmN0aW9uIGRpZmZpY3VsdHlEaWVWYWx1ZSh2YWx1ZTogc3RyaW5nKTogZ2VuRGllRmFjZXNbXSB7XHJcbiAgY29uc3Qgcm9sbCA9IGRpZmZpY3VsdHlEaWUuZ2V0KE51bWJlci5wYXJzZUludCh2YWx1ZSkpO1xyXG4gIGlmICghcm9sbCkgcmV0dXJuIFtcImJsYW5rXCJdO1xyXG4gIHJldHVybiByb2xsO1xyXG59XHJcbmZ1bmN0aW9uIHNldGJhY2tEaWVWYWx1ZSh2YWx1ZTogc3RyaW5nKTogZ2VuRGllRmFjZXNbXSB7XHJcbiAgY29uc3Qgcm9sbCA9IHNldGJhY2tEaWUuZ2V0KE51bWJlci5wYXJzZUludCh2YWx1ZSkpO1xyXG4gIGlmICghcm9sbCkgcmV0dXJuIFtcImJsYW5rXCJdO1xyXG4gIHJldHVybiByb2xsO1xyXG59XHJcbmNvbnN0IEdlblZhbHVlTWFwID0gTWFwUGx1czxnZW5EaWVUeXBlcywgKHZhbHVlOiBzdHJpbmcpID0+IGdlbkRpZUZhY2VzW10+KFtcclxuICBbXCJwcm9maWNpZW5jeVwiLCBwcm9maWNpZW5jeURpZVZhbHVlXSxcclxuICBbXCJhYmlsaXR5XCIsIGFiaWxpdHlEaWVWYWx1ZV0sXHJcbiAgW1wiYm9vc3RcIiwgYm9vc3REaWVWYWx1ZV0sXHJcbiAgW1wiY2hhbGxlbmdlXCIsIGNoYWxsZW5nZURpZVZhbHVlXSxcclxuICBbXCJkaWZmaWN1bHR5XCIsIGRpZmZpY3VsdHlEaWVWYWx1ZV0sXHJcbiAgW1wic2V0YmFja1wiLCBzZXRiYWNrRGllVmFsdWVdLFxyXG5dKTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VHZW5lc3lzRGllKGRpZTogRGllLCBkaWVUeXBlOiBnZW5EaWVUeXBlcyk6IGdlbkRpZUZhY2VzW10ge1xyXG4gIGNvbnN0IFt2YWx1ZSwgc2V0VmFsdWVdID0gdXNlU3RhdGU8c3RyaW5nIHwgdW5kZWZpbmVkPigpO1xyXG4gIGNvbnN0IFtnZW5WYWx1ZSwgc2V0R2VuVmFsdWVdID0gdXNlU3RhdGU8Z2VuRGllRmFjZXNbXT4oKTtcclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgY29uc3Qgb25WYWx1ZSA9ICh2YWx1ZTogc3RyaW5nKSA9PiBzZXRWYWx1ZSh2YWx1ZSk7XHJcbiAgICBkaWUub24oXCJ2YWx1ZVwiLCBvblZhbHVlKTtcclxuXHJcbiAgICBzZXRHZW5WYWx1ZShHZW5WYWx1ZU1hcC5nZXQoZGllVHlwZSkodmFsdWUpKTtcclxuXHJcbiAgICByZXR1cm4gKCkgPT4gZGllLm9mZihcInZhbHVlXCIsIG9uVmFsdWUpO1xyXG4gIH0sIFt2YWx1ZV0pO1xyXG5cclxuICByZXR1cm4gZ2VuVmFsdWU7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VHZW5lc3lzUmVzdWx0KCk6IHtcclxuICBzdWNjZXNzOiBudW1iZXI7XHJcbiAgdHJpdW1waDogbnVtYmVyO1xyXG4gIGFkdmFudGFnZTogbnVtYmVyO1xyXG4gIHJvbGxlZDogYm9vbGVhbjtcclxuICBzZXRSb2xsZWQ6IFJlYWN0LkRpc3BhdGNoPFJlYWN0LlNldFN0YXRlQWN0aW9uPGJvb2xlYW4+PjtcclxuICBvdXRjb21lOiBzdHJpbmc7XHJcbiAgc2lkZUVmZmVjdHM6IHN0cmluZztcclxuICBjcml0OiBzdHJpbmc7XHJcbiAgaW5wdXRSZXN1bHQ6ICh2YWx1ZXM6IGdlbkRpZUZhY2VzW10pID0+IHZvaWQ7XHJcbiAgcmVzZXRSZXN1bHRzOiAoKSA9PiB2b2lkO1xyXG59IHtcclxuICBjb25zdCBbdHJpdW1waCwgc2V0VHJpdW1waF0gPSB1c2VTdGF0ZSgwKTtcclxuICBjb25zdCBbc3VjY2Vzcywgc2V0U3VjY2Vzc10gPSB1c2VTdGF0ZSgwKTtcclxuICBjb25zdCBbYWR2YW50YWdlLCBzZXRBZHZhbnRhZ2VdID0gdXNlU3RhdGUoMCk7XHJcbiAgY29uc3QgW3JvbGxlZCwgc2V0Um9sbGVkXSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuICBjb25zdCBbb3V0Y29tZSwgc2V0T3V0Y29tZV0gPSB1c2VTdGF0ZTxzdHJpbmc+KFwiXCIpO1xyXG4gIGNvbnN0IFtzaWRlRWZmZWN0cywgc2V0U2lkZUVmZmVjdHNdID0gdXNlU3RhdGU8c3RyaW5nPihcIlwiKTtcclxuICBjb25zdCBbY3JpdCwgc2V0Q3JpdF0gPSB1c2VTdGF0ZShcIlwiKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIHNldE91dGNvbWUoc3VjY2VzcyA+IDAgPyBcIlN1Y2Nlc3NcIiA6IFwiRmFpbHVyZVwiKTtcclxuICAgIHNldFNpZGVFZmZlY3RzKFxyXG4gICAgICBhZHZhbnRhZ2UgPiAwID8gXCJBZHZhbnRhZ2UhXCIgOiBhZHZhbnRhZ2UgPCAwID8gXCJEaXNhZHZhbnRhZ2UhXCIgOiBcIlwiXHJcbiAgICApO1xyXG4gICAgc2V0Q3JpdCh0cml1bXBoID4gMCA/IFwiVHJpdW1waGFudFwiIDogdHJpdW1waCA8IDAgPyBcIkRlc3BhaXJpbmdcIiA6IFwiXCIpO1xyXG4gIH0sIFtzdWNjZXNzLCBhZHZhbnRhZ2UsIHRyaXVtcGhdKTtcclxuXHJcbiAgZnVuY3Rpb24gaW5wdXRSZXN1bHQodmFsdWVzOiBnZW5EaWVGYWNlc1tdKSB7XHJcbiAgICB2YWx1ZXMuZm9yRWFjaCgodmFsdWUpID0+IHtcclxuICAgICAgc3dpdGNoICh2YWx1ZSkge1xyXG4gICAgICAgIGNhc2UgXCJzdWNjZXNzXCI6XHJcbiAgICAgICAgICBzZXRTdWNjZXNzKChwcmV2KSA9PiBwcmV2ICsgMSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwiYWR2YW50YWdlXCI6XHJcbiAgICAgICAgICBzZXRBZHZhbnRhZ2UoKHByZXYpID0+IHByZXYgKyAxKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJ0cml1bXBoXCI6XHJcbiAgICAgICAgICBzZXRTdWNjZXNzKChwcmV2KSA9PiBwcmV2ICsgMSk7XHJcbiAgICAgICAgICBzZXRUcml1bXBoKChwcmV2KSA9PiBwcmV2ICsgMSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwiZmFpbHVyZVwiOlxyXG4gICAgICAgICAgc2V0U3VjY2VzcygocHJldikgPT4gcHJldiAtIDEpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcInRocmVhdFwiOlxyXG4gICAgICAgICAgc2V0QWR2YW50YWdlKChwcmV2KSA9PiBwcmV2IC0gMSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwiZGVzcGFpclwiOlxyXG4gICAgICAgICAgc2V0U3VjY2VzcygocHJldikgPT4gcHJldiAtIDEpO1xyXG4gICAgICAgICAgc2V0VHJpdW1waCgocHJldikgPT4gcHJldiAtIDEpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcImJsYW5rXCI6XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiByZXNldFJlc3VsdHMoKSB7XHJcbiAgICBzZXRTdWNjZXNzKDApO1xyXG4gICAgc2V0QWR2YW50YWdlKDApO1xyXG4gICAgc2V0VHJpdW1waCgwKTtcclxuICAgIHNldE91dGNvbWUoXCJcIik7XHJcbiAgICBzZXRTaWRlRWZmZWN0cyhcIlwiKTtcclxuICAgIHNldENyaXQoXCJcIik7XHJcbiAgICBzZXRSb2xsZWQoZmFsc2UpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHN1Y2Nlc3M6IHN1Y2Nlc3MsXHJcbiAgICB0cml1bXBoOiB0cml1bXBoLFxyXG4gICAgYWR2YW50YWdlOiBhZHZhbnRhZ2UsXHJcbiAgICByb2xsZWQ6IHJvbGxlZCxcclxuICAgIHNldFJvbGxlZDogc2V0Um9sbGVkLFxyXG4gICAgb3V0Y29tZTogb3V0Y29tZSxcclxuICAgIHNpZGVFZmZlY3RzOiBzaWRlRWZmZWN0cyxcclxuICAgIGNyaXQ6IGNyaXQsXHJcbiAgICBpbnB1dFJlc3VsdDogaW5wdXRSZXN1bHQsXHJcbiAgICByZXNldFJlc3VsdHM6IHJlc2V0UmVzdWx0cyxcclxuICB9O1xyXG59XHJcbiJdfQ==
