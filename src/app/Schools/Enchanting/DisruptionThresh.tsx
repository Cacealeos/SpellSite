import React, { useState } from "react";
import { Mastery } from "../../models/Mastery";

const DisruptionThresh = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState(0);
  let rate: number = 0;
  let testMastery: Mastery = new Mastery();

  if (!active) setCost(0);

  if (ParentMastery.getType() === testMastery.novice(true)) rate = 0.5;
  else if (ParentMastery.getType() === testMastery.intermediate(true))
    rate = 0.7;
  else if (ParentMastery.getType() === testMastery.mastered(true)) rate = 0.15;

  return (
    <>
      <div>
        <h1>Manna to Disruption Threshold</h1>
        <br />
        <input
          type="number"
          max="200"
          min="0"
          step="1"
          value="0"
          onChange={(e) => setCost(Number(e.target.value) * rate || 0)}
        />
        <br />
      </div>
      <br />
      <p>Info: Max temporary threshold equal to 50% of base threshold</p>
    </>
  );
};

export default DisruptionThresh;
