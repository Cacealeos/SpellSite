import React, { useState } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models/Potency";

const MannaHealing = ({
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

  if (ParentMastery.getType() == testMastery.novice()) rate = 5;
  else if (ParentMastery.getType() == testMastery.intermediate()) rate = 3;
  else if (ParentMastery.getType() == testMastery.mastered()) rate = 1;

  return (
    <>
      <div>
        <h1>Manna to Healing</h1>
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
        <p>Info: Restore Life-Force at the cost of manna</p>
      </div>
    </>
  );
};

export default MannaHealing;
