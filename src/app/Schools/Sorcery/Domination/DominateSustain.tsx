import React, { useState } from "react";
import { Mastery } from "../../../models/Mastery";
import Select from "@/app/Select";

const DominateSustain = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState(0);
  const [type, setType] = useState("");
  const Types: string[] = ["Structure", "Entity"];

  let testMastery: Mastery = new Mastery();
  let rate: number = 0;
  let TTT: number[] = [12, 10, 8, 14, 12, 10];

  if (Types.indexOf(type) == 0) {
    let index = 0;
    if (ParentMastery.getType() == testMastery.novice()) rate = TTT[index];
    else if (ParentMastery.getType() == testMastery.intermediate())
      rate = TTT[index + 1];
    else if (ParentMastery.getType() == testMastery.mastered())
      rate = TTT[index + 2];
  } else if (Types.indexOf(type) == 1) {
    let index = 3;
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
        <h1>Domination - Sustain</h1>
        <br />
        <h2>PPP: {cost}%</h2>
        <input
          type="number"
          min="0"
          step="1"
          value={cost}
          onChange={(e) => setCost(Number(e.target.value))}
        />
        <br />
        <h2>TTT: {cost * rate}</h2>
      </div>
      <Select
        choices={Types}
        changeChoice={() => changeChoice}
        title="Type"
      ></Select>
    </>
  );
};

export default DominateSustain;
