import React, { useState } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models/Potency";

const InstillEnergy = ({
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

  if (ParentMastery.getType() == testMastery.novice()) rate = 4;
  else if (ParentMastery.getType() == testMastery.intermediate()) rate = 3;
  else if (ParentMastery.getType() == testMastery.mastered()) rate = 2;

  return (
    <>
      <div>
        <h1>Instill Energy</h1>
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
        <p>
          Info: Transfer or extract manna from object. The transfer rate is
          energy to turn ratio and scales with Mastery
        </p>
      </div>
    </>
  );
};

export default InstillEnergy;
