import React, { useState, useEffect } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models/Potency";

const RejuvenateSpirit = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState(0);

  let testMastery: Mastery = new Mastery();
  let rate: number = 0;

  useEffect(() => {
    if (!active) setCost(0);
  }, [active]);

  if (ParentMastery.getType() == testMastery.novice()) rate = 6;
  else if (ParentMastery.getType() == testMastery.intermediate()) rate = 4;
  else if (ParentMastery.getType() == testMastery.mastered()) rate = 2;

  return (
    <>
      <div>
        <h1>Rejuvenate Spirit</h1>
        <br />
        <input
          type="number"
          min="0"
          step="1"
          value="0"
          onChange={(e) => setCost(Number(e.target.value) * rate || 0)}
        />
        <br />
        <p>Info: Restore Spirit</p>
      </div>
    </>
  );
};

export default RejuvenateSpirit;
