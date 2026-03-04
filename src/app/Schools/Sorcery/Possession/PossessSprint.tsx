import React, { useState } from "react";
import { Mastery } from "../../../models/Mastery";
import Select from "@/app/Select";

const PossessSprint = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState(0);
  const [type, setType] = useState("");
  const Types: string[] = [
    "Seal",
    "Construct",
    "Entity",
    "Link",
    "Orchestrate",
  ];

  let testMastery: Mastery = new Mastery();
  let rate: number = 0;
  let TTT: number[] = [6, 4, 2, 8, 6, 4, 7, 5, 3, 3, 2, 1];

  if (Types.indexOf(type) == 0 || Types.indexOf(type) == 1) {
    let index = 0;
    if (ParentMastery.getType() == testMastery.novice()) rate = TTT[index];
    else if (ParentMastery.getType() == testMastery.intermediate())
      rate = TTT[index + 1];
    else if (ParentMastery.getType() == testMastery.mastered())
      rate = TTT[index + 2];
  } else if (Types.indexOf(type) == 2) {
    let index = 3;
    if (ParentMastery.getType() == testMastery.novice()) rate = TTT[index];
    else if (ParentMastery.getType() == testMastery.intermediate())
      rate = TTT[index + 1];
    else if (ParentMastery.getType() == testMastery.mastered())
      rate = TTT[index + 2];
  } else if (Types.indexOf(type) == 3) {
    let index = 6;
    if (ParentMastery.getType() == testMastery.novice()) rate = TTT[index];
    else if (ParentMastery.getType() == testMastery.intermediate())
      rate = TTT[index + 1];
    else if (ParentMastery.getType() == testMastery.mastered())
      rate = TTT[index + 2];
  } else if (Types.indexOf(type) == 4) {
    let index = 9;
    if (ParentMastery.getType() == testMastery.novice()) rate = TTT[index];
    else if (ParentMastery.getType() == testMastery.intermediate())
      rate = TTT[index + 1];
    else if (ParentMastery.getType() == testMastery.mastered())
      rate = TTT[index + 2];
  }

  function changeChoice(choice: string) {
    setType(choice);
  }

  if (!active) setCost(0);

  return (
    <>
      <div>
        <h1>Possession Sprint</h1>
        <br />
        <input
          type="number"
          min="0"
          step="1"
          value={cost}
          onChange={(e) => setCost(Number(e.target.value))}
        />
        <br />
        <h2>TTT: {cost * rate}</h2>
        <br />
        <h2>PPP: {cost * 2} While over 50% </h2>
        <br />
        <h2>PPP: {cost * 0.5} While under 50% </h2>
      </div>
      <Select
        choices={Types}
        changeChoice={() => changeChoice}
        title="Type"
      ></Select>
    </>
  );
};

export default PossessSprint;
