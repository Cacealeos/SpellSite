import React, { useState, useEffect } from "react";
import { Mastery } from "@/app/models";
import { Potency } from "@/app/models/Potency";

const PossesionSeal = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [currentIncrement, setCurrentIncrement] = useState(0);
  const [value, setValue] = useState(0);

  let SpellPotency: Potency = new Potency();
  let testPotency: Potency = new Potency();

  //   useEffect(() => {
  //     if (!active) setCost(0);
  //   }, [active]);

  const changeChoice = (potency: string | void) => {
    if (SpellPotency.getType() === testPotency.minor()) {
      setValue(7);
    } else if (SpellPotency.getType() === testPotency.major()) {
      setValue(9);
    } else if (SpellPotency.getType() === testPotency.extreme()) {
      setValue(11);
    }
  };

  return (
    <>
      <div>
        <h1>Posession Seal</h1>

        <br />
        <span>Potency|Res Check|</span>
        <div>
          <p>Minor: |7|</p>
          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.minor())}
          />
        </div>
        <div>
          <p>Major: |9|</p>
          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.major())}
          />
        </div>
        <div>
          <p>Extreme: |11|</p>
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

export default PossesionSeal;
