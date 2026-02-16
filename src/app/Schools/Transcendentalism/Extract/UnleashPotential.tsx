import React, { useState, useEffect } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models/Potency";

const UnleashPotential = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [base, setBase] = useState(0);

  let multiplier = 0;
  let testMastery: Mastery = new Mastery();

  useEffect(() => {
    if (!active) setBase(0);
  }, [active]);

  if (ParentMastery.getType() === testMastery.novice(true)) multiplier = 1.75;
  if (ParentMastery.getType() === testMastery.intermediate(true))
    multiplier = 1.5;
  if (ParentMastery.getType() === testMastery.mastered(true)) multiplier = 1.25;

  return (
    <>
      <div>
        <h1>Unleash Potential</h1>
        <br />

        <br />
        <div>
          <input
            type="number"
            onChange={(e) => setBase(Number(e.target.value))}
          />
        </div>

        <br />
        <span>{base}</span>
      </div>
    </>
  );
};

export default UnleashPotential;
