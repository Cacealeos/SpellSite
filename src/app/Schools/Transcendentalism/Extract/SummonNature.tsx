import React, { useState, useEffect } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models/Potency";

const SummonNature = ({
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
      if (SpellPotency.getType() === testPotency.minor(true)) calculateCost(25);
      if (SpellPotency.getType() === testPotency.major(true)) calculateCost(75);
      if (SpellPotency.getType() === testPotency.extreme(true))
        calculateCost(225);
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.intermediate(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) calculateCost(15);
      if (SpellPotency.getType() === testPotency.major(true)) calculateCost(60);
      if (SpellPotency.getType() === testPotency.extreme(true))
        calculateCost(180);
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.mastered(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) calculateCost(10);
      if (SpellPotency.getType() === testPotency.major(true)) calculateCost(45);
      if (SpellPotency.getType() === testPotency.extreme(true))
        calculateCost(135);
      setPot(SpellPotency);
    }
  };

  return (
    <>
      <div>
        <h1>Summon Nature</h1>
        <br />

        <br />
        <p>Potency</p>
        <div>
          <p>Minor – 25 / 15 / 10</p>

          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.minor())}
          />
        </div>
        <div>
          <p>Major – 75 / 60 / 45</p>
          <br />

          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.major())}
          />
        </div>
        <div>
          <p>Extreme – 225 / 180 / 135</p>
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

export default SummonNature;
