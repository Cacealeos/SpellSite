import React, { useState, useEffect } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models/Potency";
import Select from "@/app/Select";


const AlterSpatial = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState({cost: 0,
    base: 0,
    range: ""
  });
   const [size, setSize] = useState("")
  const sizes: string[] = ["Small AOE", "Moderate AOE", "Large AOE"]
  const [pot, setPot] = useState(new Potency ())

   let SpellPotency: Potency = new Potency();
    let testPotency: Potency = new Potency();
  let testMastery: Mastery = new Mastery();

  useEffect(() => {
    if (!active) setCost({cost: 0,
    base: 0,
    range: ""
  });
  }, [active]);


    const changeChoice = (potency: string | void) => {
    if (ParentMastery.getType() === testMastery.novice(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) setCost({cost: 60, base: 6, range: size});
      if (SpellPotency.getType() === testPotency.major(true)) setCost({cost: 120, base: 8, range: size});
      if (SpellPotency.getType() === testPotency.extreme(true)) setCost({cost: 200, base: 10, range: size});
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.intermediate(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) setCost({cost: 45, base: 6, range: size});
      if (SpellPotency.getType() === testPotency.major(true)) setCost({cost: 100, base: 8, range: size});
      if (SpellPotency.getType() === testPotency.extreme(true)) setCost({cost: 175, base: 10, range: size});
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.mastered(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) setCost({cost: 30, base: 6, range: size});
      if (SpellPotency.getType() === testPotency.major(true)) setCost({cost: 80, base: 8, range: size});
      if (SpellPotency.getType() === testPotency.extreme(true)) setCost({cost: 150, base: 10, range: size});
      setPot(SpellPotency);
    }
  };

  return (
    <>
      <div>
        <h1>Alter Spatial</h1>
        <h3>DIRECT DAMAGE</h3>

        <h3>RANGE - DIRECT</h3>

        <h4>Minor: 60 / 45 / 30</h4>
        <h4>Res Check: 6</h4>
        <input
          type="radio"
            onChange={(e) => changeChoice(SpellPotency.minor())}
        />
        <br />
        <h4>Major: 120 / 100 / 80</h4>
        <h4>Res Check: 8</h4>
        <input
          type="radio"
            onChange={(e) => changeChoice(SpellPotency.major())}
        />
        <br />
        <h4>Extreme: 200 / 175 / 150</h4>
        <h4>Res Check: 10</h4>
        <input
          type="radio"
            onChange={(e) => changeChoice(SpellPotency.extreme())}
        />
        <br />
        <Select title="AOE" choices={sizes} changeChoice={setSize}></Select>
      </div>
      <h2>Cost: {cost.cost}</h2>
            <h2>Base: {cost.base}</h2>
      <h2>Range: {cost.range}</h2>

      
    </>
  );
};

export default AlterSpatial;
