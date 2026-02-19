import React, { useState, useEffect } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models/Potency";

const ReAwaken = ({
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
      if (SpellPotency.getType() === testPotency.minor(true)) calculateCost(90);
      if (SpellPotency.getType() === testPotency.major(true))
        calculateCost(190);
      if (SpellPotency.getType() === testPotency.extreme(true))
        calculateCost(330);
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.intermediate(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) calculateCost(70);
      if (SpellPotency.getType() === testPotency.major(true))
        calculateCost(150);
      if (SpellPotency.getType() === testPotency.extreme(true))
        calculateCost(270);
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.mastered(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) calculateCost(50);
      if (SpellPotency.getType() === testPotency.major(true))
        calculateCost(110);
      if (SpellPotency.getType() === testPotency.extreme(true))
        calculateCost(210);
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
          <p>Minor |33%, 1 turn| 90 / 70 / 50</p>

          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.minor())}
          />
        </div>
        <div>
          <p>Major |67%, 2 turn| 190 / 150 / 110</p>
          <br />

          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.major())}
          />
        </div>
        <div>
          <p>Extreme |100%, 3 turn| 330 / 270 / 210</p>
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

export default ReAwaken;
