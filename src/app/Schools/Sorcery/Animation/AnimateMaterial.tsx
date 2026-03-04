import React, { useState, useEffect } from "react";
import { Mastery } from "@/app/models";
import { Potency } from "@/app/models/Potency";

const AnimateMaterial = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [pot, setPot] = useState();
  const [TTT, setTTT] = useState(0);
  const [Increment, setIncrement] = useState(0);

  let SpellPotency: Potency = new Potency();
  let testPotency: Potency = new Potency();
  let testMastery: Mastery = new Mastery();

  //   useEffect(() => {
  //     if (!active) setCost(0);
  //   }, [active]);

  const changeChoice = (potency: string | void) => {
    if (ParentMastery.getType() === testMastery.novice(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) setTTT(12);
      if (SpellPotency.getType() === testPotency.major(true)) setTTT(8);
      if (SpellPotency.getType() === testPotency.extreme(true)) setTTT(4);
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.intermediate(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) setTTT(50);
      if (SpellPotency.getType() === testPotency.major(true)) setTTT(70);
      if (SpellPotency.getType() === testPotency.extreme(true)) setTTT(90);
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.mastered(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) setTTT(25);
      if (SpellPotency.getType() === testPotency.major(true)) setTTT(35);
      if (SpellPotency.getType() === testPotency.extreme(true)) setTTT(45);
      setPot(SpellPotency);
    }
  };

  return (
    <>
      <div>
        <h1>Animate Material</h1>

        <br />
        <span>Potency</span>
        <div>
          <p>Minor</p>
          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.minor())}
          />
        </div>
        <div>
          <p>Major</p>
          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.major())}
          />
        </div>
        <div>
          <p>Extreme</p>
          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.extreme())}
          />
        </div>
        <br />
      </div>
      <div>
        <h1>Set Seal Values</h1>
        <br />
        <div>
          <span>Disruption Increment</span>
          <br />
          <input
            type="number"
            min="0"
            max={maxIncrement}
            step="1"
            value={currentIncrement}
            onChange={(e) => setCurrentIncrement(Number(e.target.value))}
          />
        </div>
        <p>
          Disruption will be inflicted until Maximum of {threshold} is depleted
        </p>
      </div>
    </>
  );
};

export default AnimateMaterial;
