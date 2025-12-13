import React, { useState } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models/Potency";

const BreakSeal = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState(0);
  const [pot, setPot] = useState(new Potency());

  let CoherencePotency: Potency = new Potency();
  let testPotency: Potency = new Potency();
  let testMastery: Mastery = new Mastery();

  if (!active) setCost(0);

  const changeChoice = (potency: string | void) => {
    if (ParentMastery.getType() === testMastery.novice(true)) {
      if (CoherencePotency.getType() === testPotency.minor(true)) setCost(100);
      if (CoherencePotency.getType() === testPotency.major(true)) setCost(200);
      if (CoherencePotency.getType() === testPotency.extreme(true))
        setCost(300);
      setPot(CoherencePotency);
    }
    if (ParentMastery.getType() === testMastery.intermediate(true)) {
      if (CoherencePotency.getType() === testPotency.minor(true)) setCost(75);
      if (CoherencePotency.getType() === testPotency.major(true)) setCost(150);
      if (CoherencePotency.getType() === testPotency.extreme(true))
        setCost(225);
      setPot(CoherencePotency);
    }
    if (ParentMastery.getType() === testMastery.mastered(true)) {
      if (CoherencePotency.getType() === testPotency.minor(true)) setCost(50);
      if (CoherencePotency.getType() === testPotency.major(true)) setCost(100);
      if (CoherencePotency.getType() === testPotency.extreme(true))
        setCost(150);
      setPot(CoherencePotency);
    }
  };

  return (
    <>
      <div>
        <h1>Break Seal</h1>
        <br />
        <p>Potency</p>
        <div>
          <p>Minor – 100 / 75 / 50</p>
          <input
            type="checkbox"
            onChange={(e) => changeChoice(CoherencePotency.minor())}
          />
        </div>
        <div>
          <p>Major – 200 / 150 / 100</p>
          <input
            type="checkbox"
            onChange={(e) => changeChoice(CoherencePotency.major())}
          />
        </div>
        <div>
          <p>Extreme – 300 / 225 / 15</p>
          <input
            type="checkbox"
            onChange={(e) => changeChoice(CoherencePotency.extreme())}
          />
        </div>
        <br />
        <p>Info: Break Limiter Seal saftely.</p>
        <p>
          The number of targets that can communicate on the same channel scales
          with potency and environment. |GMD|
        </p>
      </div>
    </>
  );
};

export default BreakSeal;
