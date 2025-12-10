import React, { useState } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models/Potency";

const PainHealing = ({
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

  if (ParentMastery.getType() == testMastery.novice()) rate = 0.3;
  else if (ParentMastery.getType() == testMastery.intermediate()) rate = 0.2;
  else if (ParentMastery.getType() == testMastery.mastered()) rate = 0.1;

  return (
    <>
      <div>
        <h1>Manna to Pain Recovery</h1>
        <br />
        <input
          type="number"
          min="0"
          step="1"
          value="0"
          onChange={(e) => setCost(Number(e.target.value) * rate || 0)}
        />
        <br />
        <p>Alleviates building pain</p>
        <p>Pain tolerance = </p>
      </div>
    </>
  );
};

export default PainHealing;
