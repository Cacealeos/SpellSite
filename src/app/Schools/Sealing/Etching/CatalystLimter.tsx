import React, { useState, useEffect } from "react";
import { Mastery } from "@/app/models";
import { Potency } from "@/app/models/Potency";

const SpiritSoulLimiter = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [value, setValue] = useState(0);

  let SpellPotency: Potency = new Potency();
  let testPotency: Potency = new Potency();

  //   useEffect(() => {
  //     if (!active) setCost(0);
  //   }, [active]);

  const changeChoice = (potency: string | void) => {
    if (SpellPotency.getType() === testPotency.minor()) {
      setValue(5);
    } else if (SpellPotency.getType() === testPotency.major()) {
      setValue(10);
    } else if (SpellPotency.getType() === testPotency.extreme()) {
      setValue(15);
    }
  };

  return (
    <>
      <div>
        <h1>Catalyst Limiter</h1>

        <br />
        <span>Potency</span>
        <div>
          <p>Minor: |-5|</p>
          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.minor())}
          />
        </div>
        <div>
          <p>Major: |-10|</p>
          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.major())}
          />
        </div>
        <div>
          <p>Extreme: |-15|</p>
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

export default SpiritSoulLimiter;
