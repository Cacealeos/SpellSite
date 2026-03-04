import React, { useState, useEffect } from "react";
import { Mastery } from "@/app/models";
import { Potency } from "@/app/models/Potency";

const AnimateEphemeral = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [pot, setPot] = useState(new Potency());
  const [TTT, setTTT] = useState(0);
  const [increment, setIncrement] = useState(0);

  let SpellPotency: Potency = new Potency();
  let testPotency: Potency = new Potency();
  let testMastery: Mastery = new Mastery();

  useEffect(() => {
    if (!active) setPot(SpellPotency);
  }, [active]);

  const changeChoice = (potency: string | void) => {
    if (ParentMastery.getType() === testMastery.novice(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) setTTT(12);
      if (SpellPotency.getType() === testPotency.major(true)) setTTT(8);
      if (SpellPotency.getType() === testPotency.extreme(true)) setTTT(4);
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.intermediate(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) setTTT(18);
      if (SpellPotency.getType() === testPotency.major(true)) setTTT(12);
      if (SpellPotency.getType() === testPotency.extreme(true)) setTTT(6);
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.mastered(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) setTTT(24);
      if (SpellPotency.getType() === testPotency.major(true)) setTTT(16);
      if (SpellPotency.getType() === testPotency.extreme(true)) setTTT(8);
      setPot(SpellPotency);
    }
  };

  return (
    <>
      <div>
        <h1>Animate Ephemeral</h1>

        <br />
        <span>Potency</span>
        <div>
          <p>Minor: 12 / 8 / 4</p>
          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.minor())}
          />
        </div>
        <div>
          <p>Major: 18 / 12 / 6</p>
          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.major())}
          />
        </div>
        <div>
          <p>Extreme: 24 / 16 / 8</p>
          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.extreme())}
          />
        </div>
        <br />
      </div>
      <div>
        <br />
        <div>
          <h1>Cost</h1>
          <br />
          <input
            type="number"
            min="0"
            step="1"
            value={increment}
            onChange={(e) => setIncrement(Number(e.target.value))}
          />
        </div>
        <p>TTT: {TTT * increment}</p>
      </div>
    </>
  );
};

export default AnimateEphemeral;
