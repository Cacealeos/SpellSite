import React, { useState } from "react";
import { Mastery } from "../../models/Mastery";

const Disruption = ({
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

  if (ParentMastery.getType() == testMastery.novice()) rate = 4;
  else if (ParentMastery.getType() == testMastery.intermediate()) rate = 3;
  else if (ParentMastery.getType() == testMastery.mastered()) rate = 2;

  return (
    <>
      <div>
        <h1>Manna to Disruption</h1>
        <br />
        <input
          type="number"
          max="50"
          min="0"
          step="1"
          value="0"
          onChange={(e) => setCost(Number(e.target.value) * rate || 0)}
        />
        <br />
      </div>
    </>
  );
};

export default Disruption;
