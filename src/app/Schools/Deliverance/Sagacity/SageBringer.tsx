import React, { useState, useEffect } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models/Potency";

const SageBringer = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState(0);
  const [pot, setPot] = useState(new Potency());

  let SpellPotency: Potency = new Potency();
  let testPotency: Potency = new Potency();
  let testMastery: Mastery = new Mastery();

  useEffect(() => {
    if (!active) setCost(0);
  }, [active]);

  function calculateCost(cost: number) {
    setCost(cost);
  }

  const changeChoice = (potency: string | void) => {
    if (ParentMastery.getType() === testMastery.novice(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) calculateCost(90);
      if (SpellPotency.getType() === testPotency.major(true))
        calculateCost(180);
      if (SpellPotency.getType() === testPotency.extreme(true))
        calculateCost(270);
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.intermediate(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) calculateCost(60);
      if (SpellPotency.getType() === testPotency.major(true))
        calculateCost(150);
      if (SpellPotency.getType() === testPotency.extreme(true))
        calculateCost(240);
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.mastered(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) calculateCost(30);
      if (SpellPotency.getType() === testPotency.major(true))
        calculateCost(120);
      if (SpellPotency.getType() === testPotency.extreme(true))
        calculateCost(210);
      setPot(SpellPotency);
    }
  };

  return (
    <>
      <div>
        <h1>Sage Bringer</h1>
        <br />
        <p>Potency</p>
        <div>
          <p>Minor|+1| 90 / 60 / 30</p>

          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.minor())}
          />
        </div>
        <div>
          <p>Major|+2| 180 / 150 / 120</p>
          <br />

          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.major())}
          />
        </div>
        <div>
          <p>Extreme|+3| 270 / 240 / 210</p>
          <br />

          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.extreme())}
          />
        </div>
        <br />
      </div>
    </>
  );
};

export default SageBringer;
