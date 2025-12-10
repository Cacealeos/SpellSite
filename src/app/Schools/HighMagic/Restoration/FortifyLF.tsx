import React, { useState } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models/Potency";

const FortifyLF = ({
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

  if (ParentMastery.getType() == testMastery.novice()) rate = 2;
  else if (ParentMastery.getType() == testMastery.intermediate()) rate = 1.5;
  else if (ParentMastery.getType() == testMastery.mastered()) rate = 0.5;

  return (
    <>
      <div>
        <h1>Fortify Life-Force</h1>
        <br />
        <input
          type="number"
          min="0"
          step="1"
          value="0"
          onChange={(e) => setCost(Number(e.target.value) * rate || 0)}
        />
        <br />
        <p>Info: Give bonus temporary health. Up to 30% extra of current max</p>
      </div>
    </>
  );
};

export default FortifyLF;
