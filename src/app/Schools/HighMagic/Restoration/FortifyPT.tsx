import React, { useState } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models/Potency";

const FortifyPT = ({
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
        <h1>Fortify Pain Threshold</h1>
        <br />
        <input
          type="number"
          min="0"
          step="1"
          value="0"
          onChange={(e) => setCost(Number(e.target.value) * rate || 0)}
        />
        <br />
        <p>
          Info: Give bonus temporary tolerance. Up to 100% extra of current max
        </p>
        <p>Pain tolerance = </p>
      </div>
    </>
  );
};

export default FortifyPT;
