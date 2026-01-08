import React, { useState } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models/Potency";

const ConjureElement = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState(0);
  const [pot, setPot] = useState(new Potency());
  const [ModerateAOE, setModerateAOE] = useState(false);
  const [LargeAOE, setLargeAOE] = useState(false);
  const [MassiveAOE, setMassiveAOE] = useState(false);

  let SpellPotency: Potency = new Potency();
  let testPotency: Potency = new Potency();
  let testMastery: Mastery = new Mastery();

  if (!active) setCost(0);

  function calculateCost(cost: number) {
    if (ModerateAOE) cost *= 0.5;
    if (LargeAOE) cost *= 1;
    if (MassiveAOE) cost *= 3;

    setCost(cost);
  }

  const changeChoice = (potency: string | void) => {
    if (ParentMastery.getType() === testMastery.novice(true)) {
      if (SpellPotency.getType() === testPotency.minor(true))
        calculateCost(150);
      if (SpellPotency.getType() === testPotency.major(true))
        calculateCost(300);
      if (SpellPotency.getType() === testPotency.extreme(true))
        calculateCost(600);
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.intermediate(true)) {
      if (SpellPotency.getType() === testPotency.minor(true))
        calculateCost(120);
      if (SpellPotency.getType() === testPotency.major(true))
        calculateCost(240);
      if (SpellPotency.getType() === testPotency.extreme(true))
        calculateCost(480);
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.mastered(true)) {
      if (SpellPotency.getType() === testPotency.minor(true))
        calculateCost(100);
      if (SpellPotency.getType() === testPotency.major(true))
        calculateCost(180);
      if (SpellPotency.getType() === testPotency.extreme(true))
        calculateCost(360);
      setPot(SpellPotency);
    }
  };

  return (
    <>
      <div>
        <h1>Scramble Signature</h1>
        <br />
        <p>Potency</p>
        <div>
          <span>Moderate AOE: Cost - 50%</span>
          <input
            type="checkbox"
            onChange={() => setModerateAOE(!ModerateAOE)}
          />
          <span>Large AOE: Cost + 0%</span>
          <input type="checkbox" onChange={() => setLargeAOE(!LargeAOE)} />
          <span>Massive AOE: Cost + 200%</span>
          <input type="checkbox" onChange={() => setMassiveAOE(!MassiveAOE)} />
        </div>
        <div>
          <p>Minor – 150 / 120 / 100</p>
          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.minor())}
          />
        </div>
        <div>
          <p>Major – 300 / 240 / 180</p>
          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.major())}
          />
        </div>
        <div>
          <p>Extreme – 600 / 480 / 360</p>
          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.extreme())}
          />
        </div>
        <br />
        <p>
          Info: Damages and terminates all transmissions of via Resonance and
          manna-based mental communications within large AOE until rectified.
        </p>
        <p>Potency scales with extent of damage.</p>
      </div>
    </>
  );
};

export default ConjureElement;
