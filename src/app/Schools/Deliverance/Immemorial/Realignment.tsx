import React, { useState, useEffect } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models/Potency";

const Realignment = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState(0);
  const [pot, setPot] = useState(new Potency());
  const [range, setRange] = useState(0);

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
      if (SpellPotency.getType() === testPotency.minor(true)) calculateCost(40);
      if (SpellPotency.getType() === testPotency.major(true)) calculateCost(80);
      if (SpellPotency.getType() === testPotency.extreme(true))
        calculateCost(120);
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.intermediate(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) calculateCost(30);
      if (SpellPotency.getType() === testPotency.major(true)) calculateCost(60);
      if (SpellPotency.getType() === testPotency.extreme(true))
        calculateCost(90);
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.mastered(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) calculateCost(20);
      if (SpellPotency.getType() === testPotency.major(true)) calculateCost(40);
      if (SpellPotency.getType() === testPotency.extreme(true))
        calculateCost(60);
      setPot(SpellPotency);
    }
  };

  return (
    <>
      <div>
        <h1>Unveil</h1>
        <br />
        <p>Potency</p>
        <div>
          <p>Minor 40 / 30 / 20</p>

          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.minor())}
          />
        </div>
        <div>
          <p>Major 80 / 60 / 40</p>
          <br />

          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.major())}
          />
        </div>
        <div>
          <p>Extreme 120 / 90 / 60</p>
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

export default Realignment;
