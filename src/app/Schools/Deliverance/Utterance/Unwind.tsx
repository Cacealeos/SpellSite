import React, { useState, useEffect } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models/Potency";

const Unwind = ({
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
      if (SpellPotency.getType() === testPotency.minor(true)) calculateCost(45);
      if (SpellPotency.getType() === testPotency.major(true)) calculateCost(75);
      if (SpellPotency.getType() === testPotency.extreme(true))
        calculateCost(105);
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.intermediate(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) calculateCost(35);
      if (SpellPotency.getType() === testPotency.major(true)) calculateCost(65);
      if (SpellPotency.getType() === testPotency.extreme(true))
        calculateCost(95);
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.mastered(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) calculateCost(25);
      if (SpellPotency.getType() === testPotency.major(true)) calculateCost(55);
      if (SpellPotency.getType() === testPotency.extreme(true))
        calculateCost(85);
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
          <p>Minor 45 / 35 / 25</p>

          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.minor())}
          />
        </div>
        <div>
          <p>Major 75 / 65 / 55</p>
          <br />

          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.major())}
          />
        </div>
        <div>
          <p>Extreme 105 / 95 / 85</p>
          <br />

          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.extreme())}
          />
        </div>
        <br />
        <div>
          <p>Range</p>
          <div>
            <p>Small AOE: Cost x 1</p>

            <input type="checkbox" onChange={() => setRange(1)} />
          </div>
          <div>
            <p>Moderate AOE: Cost x 1.5</p>
            <br />

            <input type="checkbox" onChange={(e) => setRange(1.5)} />
          </div>
          <div>
            <p>Large AOE: Cost x 3</p>
            <br />

            <input type="checkbox" onChange={(e) => setRange(3)} />
          </div>
          <br />
          <span>Cost: {cost * range}</span>
        </div>
      </div>
    </>
  );
};

export default Unwind;
