import React, { useState } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models/Potency";

const DisruptTarget = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState(0);
  const [ModerateAOE, setModerateAOE] = useState(false);
  const [SmallAOE, setSmallAOE] = useState(false);

  let rate: number = 0;
  let testMastery: Mastery = new Mastery();

  if (!active) setCost(0);

  function calculateCost(cost: number) {
    if (ModerateAOE) cost *= 1;
    if (SmallAOE) cost *= 3;

    setCost(cost);
  }

  if (ParentMastery.getType() === testMastery.novice(true)) rate = 6;
  else if (ParentMastery.getType() === testMastery.intermediate(true)) rate = 4;
  else if (ParentMastery.getType() === testMastery.mastered(true)) rate = 2;

  return (
    <>
      <div>
        <h1>Disrupt Target</h1>
        <br />
        <p>Area of Effect</p>
        <div>
          <span>Small AOE: Cost + 0%</span>
          <input type="checkbox" onChange={() => setSmallAOE(!SmallAOE)} />
          <span>Moderate AOE: Cost + 200%</span>
          <input
            type="checkbox"
            onChange={() => setModerateAOE(!ModerateAOE)}
          />
        </div>
        <br />
        <input
          type="number"
          max="200"
          min="0"
          step="1"
          value="0"
          onChange={(e) => calculateCost(Number(e.target.value) * rate || 0)}
        />
        <br />
      </div>
      <br />
      <p>KINETIC</p>
      <br />
      <p>RANGE - CLOUD</p>
      <p>
        Info: Use a manna to disruption ratio to determine disruption strength.
        Disruption affects Saturation at a of 4 to 1
      </p>
    </>
  );
};

export default DisruptTarget;
