import React, { useState, useEffect } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models/Potency";

const OccupyConsciousness = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState(0);
  const [pot, setPot] = useState(new Potency ())

   let SpellPotency: Potency = new Potency();
    let testPotency: Potency = new Potency();
  let testMastery: Mastery = new Mastery();

  useEffect(() => {
    if (!active) setCost(0);
  }, [active]);


    const changeChoice = (potency: string | void) => {
    if (ParentMastery.getType() === testMastery.novice(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) setCost(60);
      if (SpellPotency.getType() === testPotency.major(true)) setCost(120);
      if (SpellPotency.getType() === testPotency.extreme(true)) setCost(240);
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.intermediate(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) setCost(40);
      if (SpellPotency.getType() === testPotency.major(true)) setCost(100);
      if (SpellPotency.getType() === testPotency.extreme(true)) setCost(200);
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.mastered(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) setCost(20);
      if (SpellPotency.getType() === testPotency.major(true)) setCost(80);
      if (SpellPotency.getType() === testPotency.extreme(true)) setCost(160);
      setPot(SpellPotency);
    }
  };

  return (
    <>
      <div>
        <h1>Manifest Death</h1>
        <h3>RANGE - DIRECT</h3>

        <h4>Minor: 60 / 40 / 20</h4>
        <input
          type="radio"
            onChange={(e) => changeChoice(SpellPotency.minor())}
        />
        <br />
        <h4>Major: 120 / 100 / 80</h4>
        <input
          type="radio"
            onChange={(e) => changeChoice(SpellPotency.major())}
        />
        <br />
        <h4>Extreme: 240 / 200 / 160</h4>
        <input
          type="radio"
            onChange={(e) => changeChoice(SpellPotency.extreme())}
        />
        <br />
      </div>
      <h2>Cost: {cost}</h2>

      
    </>
  );
};

export default OccupyConsciousness;
