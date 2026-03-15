import React, { useState, useEffect } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models/Potency";

const TransmuteMass = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
    const [ttt, setTTT] = useState(0)
  const [cost, setCost] = useState(0);
  const [pot, setPot] = useState(new Potency());

    let SpellPotency: Potency = new Potency();
    let testPotency: Potency = new Potency();
  let testMastery: Mastery = new Mastery();
  let rate: number = 0;

  useEffect(() => {
    if (!active) setCost(0);
  }, [active]);

  if (ParentMastery.getType() == testMastery.novice()) rate = 15;
  else if (ParentMastery.getType() == testMastery.intermediate()) rate = 13;
  else if (ParentMastery.getType() == testMastery.mastered()) rate = 11;

  const changeChoice = (potency: string | void) => {
    if (ParentMastery.getType() === testMastery.novice(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) setCost(100);
      if (SpellPotency.getType() === testPotency.major(true)) setCost(300);
      if (SpellPotency.getType() === testPotency.extreme(true))
        setCost(900);
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.intermediate(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) setCost(75);
      if (SpellPotency.getType() === testPotency.major(true)) setCost(225);
      if (SpellPotency.getType() === testPotency.extreme(true))
        setCost(675);
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.mastered(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) setCost(50);
      if (SpellPotency.getType() === testPotency.major(true)) setCost(150);
      if (SpellPotency.getType() === testPotency.extreme(true))
        setCost(450);
      setPot(SpellPotency);
    }
    
  };


  return (
    <>
      <div>
        
      <div>

        <h2>Potency</h2>
        <div>
          <p>Minor 100 / 75 / 50</p>

          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.minor())}
          />
        </div>
        <div>
          <p>Major 300 / 225 / 150</p>
          <br />

          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.major())}
          />
        </div>
        <div>
          <p>Extreme 900 / 675 / 450</p>
          <br />

          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.extreme())}
          />
        </div>
        <br />
      </div>
        <h1>Manna to Endurance</h1>
        <br />
        <input
          type="number"
          min="0"
          max="4"
          step="1"
          value={ttt}
          onChange={(e) => setTTT(Number(e.target.value))}
        />
        <br />
      </div>
    </>
  );
};

export default TransmuteMass;
