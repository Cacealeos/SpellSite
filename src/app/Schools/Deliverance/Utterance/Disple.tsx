import React, { useState, useEffect } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models/Potency";

const RefuteDispel = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState(0);
  const [pot, setPot] = useState(new Potency());
  const [base, setBase] = useState(0);
  const [Int, setInt] = useState(0);

  let SpellPotency: Potency = new Potency();
  let testPotency: Potency = new Potency();
  let testMastery: Mastery = new Mastery();

  useEffect(() => {
    if (!active) setCost(0);
  }, [active]);

  function calculateCost(cost: number) {
    setCost(cost);
  }

  const changeChoice = (potency: string | void, Base: number) => {
    if (ParentMastery.getType() === testMastery.novice(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) calculateCost(35);
      if (SpellPotency.getType() === testPotency.major(true)) calculateCost(65);
      if (SpellPotency.getType() === testPotency.extreme(true))
        calculateCost(95);
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.intermediate(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) calculateCost(25);
      if (SpellPotency.getType() === testPotency.major(true)) calculateCost(55);
      if (SpellPotency.getType() === testPotency.extreme(true))
        calculateCost(85);
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.mastered(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) calculateCost(15);
      if (SpellPotency.getType() === testPotency.major(true)) calculateCost(45);
      if (SpellPotency.getType() === testPotency.extreme(true))
        calculateCost(75);
      setPot(SpellPotency);
    }
    setBase(Base);
  };

  return (
    <>
      <div>
        <h1>Dispel</h1>
        <br />
        <p>Potency</p>
        <div>
          <p>Minor 35 / 25 / 15</p>

          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.minor(), 5)}
          />
        </div>
        <div>
          <p>Major 65 / 55 / 45</p>
          <br />

          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.major(), 6)}
          />
        </div>
        <div>
          <p>Extreme 95 / 85 / 75</p>
          <br />

          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.extreme(), 7)}
          />
        </div>
        <br />
      </div>
      <div>
        <h2>Int</h2>
        <div>
          <input
            type="number"
            onChange={(e) => setInt(Number(e.target.value))}
          />
        </div>

        <br />
        <span>Check: {Int / 2 + base}</span>
      </div>
    </>
  );
};

export default RefuteDispel;
