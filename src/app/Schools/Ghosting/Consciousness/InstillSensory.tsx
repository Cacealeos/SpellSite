import React, { useState, useEffect } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models/Potency";

const InstillSensory = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState({cost: 0,
    base: 0
  });
  const [pot, setPot] = useState(new Potency ())

   let SpellPotency: Potency = new Potency();
    let testPotency: Potency = new Potency();
  let testMastery: Mastery = new Mastery();

  useEffect(() => {
    if (!active) setCost({cost: 0,
    base: 0
  });
  }, [active]);


    const changeChoice = (potency: string | void) => {
    if (ParentMastery.getType() === testMastery.novice(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) setCost({cost: 20, base: 3});
      if (SpellPotency.getType() === testPotency.major(true)) setCost({cost: 35, base: 5});
      if (SpellPotency.getType() === testPotency.extreme(true)) setCost({cost: 50, base: 7});
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.intermediate(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) setCost({cost: 15, base: 3});
      if (SpellPotency.getType() === testPotency.major(true)) setCost({cost: 30, base: 5});
      if (SpellPotency.getType() === testPotency.extreme(true)) setCost({cost: 45, base: 7});
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.mastered(true)) {
     if (SpellPotency.getType() === testPotency.minor(true)) setCost({cost: 10, base: 3});
      if (SpellPotency.getType() === testPotency.major(true)) setCost({cost: 25, base: 5});
      if (SpellPotency.getType() === testPotency.extreme(true)) setCost({cost: 40, base: 7});
      setPot(SpellPotency);
    }
  };

  return (
    <>
      <div>
        <h1>Instill Sensory</h1>
        <h3>RANGE - DIRECT</h3>

        <h4>Minor: 20 / 15 / 10</h4>
        <h4>Bonus: +3</h4>
        <input
          type="radio"
            onChange={(e) => changeChoice(SpellPotency.minor())}
        />
        <br />
        <h4>Major: 35 / 30 / 25</h4>
        <h4>Bonus: +5</h4>
        <input
          type="radio"
            onChange={(e) => changeChoice(SpellPotency.major())}
        />
        <br />
        <h4>Extreme: 50 / 45 / 40</h4>
        <h4>Bonus: +7</h4>
        <input
          type="radio"
            onChange={(e) => changeChoice(SpellPotency.extreme())}
        />
        <br />
      </div>
      <h2>Cost: {cost.cost}</h2>
            <h2>Bonus: {cost.base}</h2>

      
    </>
  );
};

export default InstillSensory;
