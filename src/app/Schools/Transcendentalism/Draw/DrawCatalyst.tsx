import React, { useState, useEffect } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models/Potency";

const DrawCatalyst = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState(0);
  const [pot, setPot] = useState(new Potency());
  const TTT = 20;

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
      if (SpellPotency.getType() === testPotency.minor(true)) calculateCost(60);
      if (SpellPotency.getType() === testPotency.major(true)) calculateCost(90);
      if (SpellPotency.getType() === testPotency.extreme(true))
        calculateCost(120);
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.intermediate(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) calculateCost(45);
      if (SpellPotency.getType() === testPotency.major(true)) calculateCost(75);
      if (SpellPotency.getType() === testPotency.extreme(true))
        calculateCost(105);
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.mastered(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) calculateCost(30);
      if (SpellPotency.getType() === testPotency.major(true)) calculateCost(60);
      if (SpellPotency.getType() === testPotency.extreme(true))
        calculateCost(90);
      setPot(SpellPotency);
    }
  };

  return (
    <>
      <div>
        <h1>Draw Catalyst</h1>
        <br />

        <br />
        <p>Potency</p>
        <div>
          <p>Minor – 60 / 45 / 30</p>

          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.minor())}
          />
        </div>
        <div>
          <p>Major – 90 / 75 / 60</p>
          <br />

          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.major())}
          />
        </div>
        <div>
          <p>Extreme – 120 / 105 / 90</p>
          <br />

          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.extreme())}
          />
        </div>
        <br />
        <div>
          <p>{TTT}</p>
        </div>
      </div>
    </>
  );
};

export default DrawCatalyst;
