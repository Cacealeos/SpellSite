import React, { useState, useEffect } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models/Potency";

const EnforceEthereal = ({
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
      if (SpellPotency.getType() === testPotency.minor(true))
        calculateCost(150);
      if (SpellPotency.getType() === testPotency.major(true))
        calculateCost(900);
      if (SpellPotency.getType() === testPotency.extreme(true))
        calculateCost(5400);
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.intermediate(true)) {
      if (SpellPotency.getType() === testPotency.minor(true))
        calculateCost(100);
      if (SpellPotency.getType() === testPotency.major(true))
        calculateCost(600);
      if (SpellPotency.getType() === testPotency.extreme(true))
        calculateCost(3600);
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.mastered(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) calculateCost(50);
      if (SpellPotency.getType() === testPotency.major(true))
        calculateCost(300);
      if (SpellPotency.getType() === testPotency.extreme(true))
        calculateCost(1800);
      setPot(SpellPotency);
    }
  };

  return (
    <>
      <div>
        <h1>Enforce Ethereal</h1>
        <br />
        <p>Potency</p>
        <div>
          <p>Minor 150 / 100 / 50</p>

          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.minor())}
          />
        </div>
        <div>
          <p>Major 900 / 600 / 300</p>
          <br />

          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.major())}
          />
        </div>
        <div>
          <p>Extreme 5400 / 3600 / 1800</p>
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

export default EnforceEthereal;
