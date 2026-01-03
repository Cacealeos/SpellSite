import React, { useState } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models";

const ProjectWave = ({
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
      if (SpellPotency.getType() === testPotency.minor(true)) setCost(15);
      if (SpellPotency.getType() === testPotency.major(true)) setCost(10);
      if (SpellPotency.getType() === testPotency.extreme(true)) setCost(5);
      setRate(3);
    }
    if (ParentMastery.getType() === testMastery.intermediate(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) setCost(50);
      if (SpellPotency.getType() === testPotency.major(true)) setCost(35);
      if (SpellPotency.getType() === testPotency.extreme(true)) setCost(25);
      setRate(5);
    }
    if (ParentMastery.getType() === testMastery.mastered(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) setCost(100);
      if (SpellPotency.getType() === testPotency.major(true)) setCost(80);
      if (SpellPotency.getType() === testPotency.extreme(true)) setCost(60);
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
          <p>Minor – 15 / 10 / 5</p>
          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.minor())}
          />
        </div>
        <div>
          <p>Major – 50 / 35 / 25</p>
          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.major())}
          />
        </div>
        <div>
          <p>Extreme – 100 / 80 / 60</p>
          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.extreme())}
          />
        </div>
        <br />
        <p>
          Info: Produces light waves with the user’s manna signature as a
          message or to disrupt active channels. Uses a TTT cost to sustain
          broadcast.
        </p>
        <p>
          Potency scales with strength, complexity, and resilience of signal.
        </p>
      </div>
    </>
  );
};

export default ProjectWave;
