import React, { useState, useEffect } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models/Potency";
import Select from "@/app/Select";


const ManifestDeath = ({
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
      if (SpellPotency.getType() === testPotency.minor(true)) setCost({cost: 60, base: 6});
      if (SpellPotency.getType() === testPotency.major(true)) setCost({cost: 120, base: 7});
      if (SpellPotency.getType() === testPotency.extreme(true)) setCost({cost: 200, base: 8});
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.intermediate(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) setCost({cost: 45, base: 6});
      if (SpellPotency.getType() === testPotency.major(true)) setCost({cost: 100, base: 7});
      if (SpellPotency.getType() === testPotency.extreme(true)) setCost({cost: 175, base: 8});
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.mastered(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) setCost({cost: 30, base: 6});
      if (SpellPotency.getType() === testPotency.major(true)) setCost({cost: 80, base: 7});
      if (SpellPotency.getType() === testPotency.extreme(true)) setCost({cost: 150, base: 8});
      setPot(SpellPotency);
    }
  };

  return (
    <>
      <div>
        <h1>Manifest Death</h1>
        <h3>RANGE - DIRECT</h3>

        <h4>Minor: 60 / 45 / 30</h4>
        <h4>Res Check: 6</h4>
        <input
          type="radio"
            onChange={(e) => changeChoice(SpellPotency.minor())}
        />
        <br />
        <h4>Major: 120 / 100 / 80</h4>
        <h4>Res Check: 7</h4>
        <input
          type="radio"
            onChange={(e) => changeChoice(SpellPotency.major())}
        />
        <br />
        <h4>Extreme: 200 / 175 / 150</h4>
        <h4>Res Check: 8</h4>
        <input
          type="radio"
            onChange={(e) => changeChoice(SpellPotency.extreme())}
        />
        <br />
      </div>
      <h2>Cost: {cost.cost}</h2>
            <h2>Res: {cost.base}</h2>

      
    </>
  );
};

export default ManifestDeath;
