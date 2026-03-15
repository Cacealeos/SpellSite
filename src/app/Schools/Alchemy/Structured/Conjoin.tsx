import React, { useState, useEffect } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models/Potency";
import { types, Costs } from "./costsData";
import Select from "@/app/Select";

const Conjoin = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState(0);
  const [pot, setPot] = useState(new Potency());
  const [type, setType] = useState("Organic")
  
  let SpellPotency: Potency = new Potency();
  let testPotency: Potency = new Potency();
  let testMastery: Mastery = new Mastery();
  let index = types.indexOf(type)*3;
  let array: string = Costs[type as keyof typeof Costs ].slice(index, index + 2).join("/ ")

  useEffect(() => {
    if (!active) setCost(0);
  }, [active]);

  const changeChoice = (potency: string | void) => {

    if (ParentMastery.getType() === testMastery.novice(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) setCost(Costs[type as keyof typeof Costs ][index] )
      if (SpellPotency.getType() === testPotency.major(true)) setCost(Costs[type as keyof typeof Costs][index + 1])
      if (SpellPotency.getType() === testPotency.extreme(true))
setCost(Costs[type as keyof typeof Costs][index + 2])
            setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.intermediate(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) setCost(Costs[type as keyof typeof Costs][index])
      if (SpellPotency.getType() === testPotency.major(true)) setCost(Costs[type as keyof typeof Costs][index + 1])
      if (SpellPotency.getType() === testPotency.extreme(true))
        setCost(Costs[type as keyof typeof Costs][index + 2])
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.mastered(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) setCost(Costs[type as keyof typeof Costs][index])
      if (SpellPotency.getType() === testPotency.major(true)) setCost(Costs[type as keyof typeof Costs][index + 1])
      if (SpellPotency.getType() === testPotency.extreme(true))
        setCost(Costs[type as keyof typeof Costs][index + 2])
      setPot(SpellPotency);
    }
  };

  return (
    <>
      <div>
        <h1>Conjoin</h1>
        <Select title="TYPE" changeChoice={()=>setType} choices={types}></Select>
      <div>
        <h2>Potency</h2>
        <div>
          <h3>Minor {array}</h3>

          <input
            type="radio"
            onChange={(e) => changeChoice(SpellPotency.minor())}
          />
        </div>
        <div>
          <h3>Major {array}</h3>
          <input
            type="radio"
            onChange={(e) => changeChoice(SpellPotency.major())}
          />
        </div>
        <div>
          <h3>Extreme {array}</h3>
          <input
            type="radio"
            onChange={(e) => changeChoice(SpellPotency.extreme())}
          />
        </div>
        <br />
      </div>
      </div>
    </>
  );
};

export default Conjoin;
