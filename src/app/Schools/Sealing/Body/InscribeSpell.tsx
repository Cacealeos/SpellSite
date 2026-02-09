import React, { useState, useEffect } from "react";
import { Mastery } from "@/app/models";
import { Potency } from "@/app/models/Potency";

const InscribeSpellSeal = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [MMS, setMMS] = useState(0);
  const [Use, setUse] = useState(0);
  const [compound, setCompound] = useState(0);
  const [totalRedCost, setTotalRedCost] = useState(0);
  const [totalChargeCost, settotalChargeCost] = useState(0);

  let SpellPotency: Potency = new Potency();
  let testPotency: Potency = new Potency();
  let testMastery: Mastery = new Mastery();
  let CostStipulationRate = 0;
  let ChargeStipulationRate = 0;
  let UseStipulation = 5;
  let compoundRate = 10;

  useEffect(() => {
    if (!active) setMMS(0);
  }, [active]);

  if (ParentMastery.getType() === testMastery.novice(true)) {
    CostStipulationRate = 0.05;
    ChargeStipulationRate = 0.03;
  } else if (ParentMastery.getType() === testMastery.intermediate(true)) {
    CostStipulationRate = 0.03;
    ChargeStipulationRate = 0.05;
  } else if (ParentMastery.getType() === testMastery.mastered(true)) {
    CostStipulationRate = 0.2;
    ChargeStipulationRate = 0.1;
  }

  return (
    <>
      <div>
        <h1>Maximum Caster Manna |MMS|</h1>
        <br />
        <h2></h2>
        <br />
        <input
          type="number"
          max="500"
          min="0"
          value={MMS}
          onChange={(e) => setMMS(Number(e.target.value))}
        />
        <br />
        <h1>Inscribe Spell Seal</h1>
        <br />
        <h2>Stipulations:</h2>
        <br />
        <h3>Limited Cost</h3>
        <br />
        <input
          type="number"
          max="5"
          min="0"
          step={CostStipulationRate}
          value={totalRedCost}
          onChange={(e) => setTotalRedCost(Number(e.target.value))}
        />
        <br /> <br />
        <h3>Limited Charge</h3>
        <br />
        <input
          type="number"
          max="30"
          min="0"
          step={ChargeStipulationRate}
          value={totalChargeCost}
          onChange={(e) => settotalChargeCost(Number(e.target.value))}
        />
        <h3>Limited Use</h3>
        <br />
        <input
          type="number"
          max="5"
          min="0"
          value={Use}
          onChange={(e) => setUse(Number(e.target.value))}
        />
        <h3>Limited Compound</h3>
        <br />
        <input
          type="number"
          max="5"
          min="0"
          value={compound}
          onChange={(e) => setCompound(Number(e.target.value))}
        />
      </div>
    </>
  );
};

export default InscribeSpellSeal;
