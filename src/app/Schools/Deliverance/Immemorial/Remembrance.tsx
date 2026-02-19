import React, { useState, useEffect } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models/Potency";

const Remembrance = ({
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
        calculateCost(100);
      if (SpellPotency.getType() === testPotency.major(true))
        calculateCost(250);
      if (SpellPotency.getType() === testPotency.extreme(true))
        calculateCost(500);
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.intermediate(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) calculateCost(75);
      if (SpellPotency.getType() === testPotency.major(true))
        calculateCost(150);
      if (SpellPotency.getType() === testPotency.extreme(true))
        calculateCost(350);
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.mastered(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) calculateCost(40);
      if (SpellPotency.getType() === testPotency.major(true))
        calculateCost(100);
      if (SpellPotency.getType() === testPotency.extreme(true))
        calculateCost(200);
      setPot(SpellPotency);
    }
  };

  return (
    <>
      <div>
        <h1>ReAwaken</h1>
        <br />
        <p>Potency</p>
        <h3>RANGE - RADIAL</h3>
        <div>
          <p>Minor |1 turn| 100 / 75 / 40</p>

          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.minor())}
          />
        </div>
        <div>
          <p>Major |2 turn| 250 / 150 / 100</p>
          <br />

          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.major())}
          />
        </div>
        <div>
          <p>Extreme |3 turn| 500 / 350 / 200</p>
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

export default Remembrance;
