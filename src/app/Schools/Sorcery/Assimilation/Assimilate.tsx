import React, { useState } from "react";
import { Mastery } from "../../../models/Mastery";
import Select from "@/app/Select";

const Assimilate = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState(0);
  const [type, setType] = useState("");
  const Types: string[] = ["Sustained", "Mount", "Sprint"];

  let testMastery: Mastery = new Mastery();
  let rate: number = 0;

  if (ParentMastery.getType() == testMastery.novice()) rate = 20;
  else if (ParentMastery.getType() == testMastery.intermediate()) rate = 18;
  else if (ParentMastery.getType() == testMastery.mastered()) rate = 15;

  function changeChoice(choice: string) {
    setType(choice);
  }

  if (!active) setCost(0);

  return (
    <>
      <div>
        <h1>Assimilation - Sustain</h1>
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
        <br />
        <h2>PPP: {cost * 2} While under 50% </h2>
        <br />
        <h2>PPP: {cost * 0.5} While over 50% </h2>
      </div>
      <Select
        choices={Types}
        changeChoice={() => changeChoice}
        title="Type"
      ></Select>
    </>
  );
};

export default Assimilate;
