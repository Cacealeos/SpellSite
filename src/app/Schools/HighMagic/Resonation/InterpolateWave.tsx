import React, { useState } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models";

const InterpolateWave = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState(0);
  const [rate, setRate] = useState(0);
  let testMastery: Mastery = new Mastery();

  let SpellPotency: Potency = new Potency();
  let testPotency: Potency = new Potency();

  if (!active) setCost(0);

  const changeChoice = (potency: string | void) => {
    if (ParentMastery.getType() === testMastery.novice(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) setCost(30);
      if (SpellPotency.getType() === testPotency.major(true)) setCost(20);
      if (SpellPotency.getType() === testPotency.extreme(true)) setCost(10);
      setRate(3);
    }
    if (ParentMastery.getType() === testMastery.intermediate(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) setCost(75);
      if (SpellPotency.getType() === testPotency.major(true)) setCost(60);
      if (SpellPotency.getType() === testPotency.extreme(true)) setCost(45);
      setRate(5);
    }
    if (ParentMastery.getType() === testMastery.mastered(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) setCost(150);
      if (SpellPotency.getType() === testPotency.major(true)) setCost(120);
      if (SpellPotency.getType() === testPotency.extreme(true)) setCost(90);
      setRate(8);
    }
  };

  return (
    <>
      <div>
        <h1>Project Wave</h1>
        <br />
        <p>Potency</p>

        <div>
          <p>Minor – 30 / 20 / 10</p>
          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.minor())}
          />
        </div>
        <div>
          <p>Major – 75 / 60 / 45</p>
          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.major())}
          />
        </div>
        <div>
          <p>Extreme – 150 / 120 / 90</p>
          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.extreme())}
          />
        </div>
        <br />
        <p>
          Info: Detects light waves outside the visible spectrum but cannot
          interpret them without some kind of key.
        </p>
        <p>
          Also allows for the insertion of “noise” to such signals at the risk
          of projecting the caster manna signature.
        </p>
        <p>Uses a TTT cost to sustain broadcast.</p>
        <p>
          Potency scales with the parsing ability, and the strength of noise and
          signals detected.
        </p>
      </div>
    </>
  );
};

export default InterpolateWave;
