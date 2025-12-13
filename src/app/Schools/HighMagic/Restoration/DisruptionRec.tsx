import React, { useState } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models/Potency";

const DisruptionRec = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState(0);
  const [pot, setPot] = useState(new Potency());

  let testMastery: Mastery = new Mastery();
  let rate: number = 0;

  if (!active) setCost(0);

  if (ParentMastery.getType() == testMastery.novice()) rate = 8;
  else if (ParentMastery.getType() == testMastery.intermediate()) rate = 4;
  else if (ParentMastery.getType() == testMastery.mastered()) rate = 2;

  return (
    <>
      <div>
        <h1>Recover Disruption: : 8 / 4 / 2</h1>
        <br />
        <input
          type="number"
          min="0"
          step="1"
          value="0"
          onChange={(e) => setCost(Number(e.target.value) * rate || 0)}
        />
        <br />
        <p>Info: Removes disruption build up. Inefficiently</p>
      </div>
    </>
  );
};

export default DisruptionRec;
