import React, { useState, useEffect } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models/Potency";

const DrawSoul = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState(0);
  const [pot, setPot] = useState(new Potency());
  const TTT = 35;

  let SpellPotency: Potency = new Potency();
  let testPotency: Potency = new Potency();

  useEffect(() => {
    if (!active) setCost(0);
  }, [active]);

  function calculateCost(cost: number) {
    setCost(cost);
  }

  const changeChoice = (potency: string | void) => {
    if (SpellPotency.getType() === testPotency.minor(true)) calculateCost(100);
    if (SpellPotency.getType() === testPotency.major(true)) calculateCost(200);
    if (SpellPotency.getType() === testPotency.extreme(true))
      calculateCost(300);
    setPot(SpellPotency);
  };

  return (
    <>
      <div>
        <h1>Draw Catalyst</h1>
        <br />

        <br />
        <p>Potency</p>
        <div>
          <p>Minor – 100</p>

          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.minor())}
          />
        </div>
        <div>
          <p>Major – 200</p>
          <br />

          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.major())}
          />
        </div>
        <div>
          <p>Extreme – 300</p>
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

export default DrawSoul;
