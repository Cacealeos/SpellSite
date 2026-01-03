import React, { useState } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models/Potency";

const ResonateSpell = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState(0);
  const [pot, setPot] = useState(new Potency());

  let CoherencePotency: Potency = new Potency();
  let testPotency: Potency = new Potency();
  let testMastery: Mastery = new Mastery();

  if (!active) setCost(0);

  const changeChoice = (potency: string | void) => {
    if (ParentMastery.getType() === testMastery.novice(true)) {
      if (CoherencePotency.getType() === testPotency.minor(true)) setCost(35);
      if (CoherencePotency.getType() === testPotency.major(true)) setCost(100);
      if (CoherencePotency.getType() === testPotency.extreme(true))
        setCost(200);
      setPot(CoherencePotency);
    }
    if (ParentMastery.getType() === testMastery.intermediate(true)) {
      if (CoherencePotency.getType() === testPotency.minor(true)) setCost(20);
      if (CoherencePotency.getType() === testPotency.major(true)) setCost(75);
      if (CoherencePotency.getType() === testPotency.extreme(true))
        setCost(160);
      setPot(CoherencePotency);
    }
    if (ParentMastery.getType() === testMastery.mastered(true)) {
      if (CoherencePotency.getType() === testPotency.minor(true)) setCost(5);
      if (CoherencePotency.getType() === testPotency.major(true)) setCost(50);
      if (CoherencePotency.getType() === testPotency.extreme(true))
        setCost(120);
      setPot(CoherencePotency);
    }
  };

  return (
    <>
      <div>
        <h1>Resonate Spell</h1>
        <br />
        <p>Potency</p>
        <div>
          <p>Minor – 35 / 20 / 5</p>
          <input
            type="checkbox"
            onChange={(e) => changeChoice(CoherencePotency.minor())}
          />
        </div>
        <div>
          <p>Major – 100 / 75 / 50</p>
          <input
            type="checkbox"
            onChange={(e) => changeChoice(CoherencePotency.major())}
          />
        </div>
        <div>
          <p>Extreme – 200 / 160 / 120</p>
          <input
            type="checkbox"
            onChange={(e) => changeChoice(CoherencePotency.extreme())}
          />
        </div>
        <br />
        <p>
          Info: Send transmission sent as manna fluctuations from large
          distances.
        </p>
        <p>
          Sending signal give away the position of the caster if there are
          receivers to intercept.
        </p>
        <p>
          Potency scales with strength and resilience of signal. Stronger
          signals are easier to detect. Resilient signals are resistant to
          scrambling.
        </p>
      </div>
    </>
  );
};

export default ResonateSpell;
