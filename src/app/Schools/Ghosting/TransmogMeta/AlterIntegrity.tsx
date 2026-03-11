import React, { useState, useEffect } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models/Potency";
import Select from "@/app/Select";

const AlterIntegrity = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState(0);
   const [size, setSize] = useState("")
  const sizes: string[] = ["Small AOE", "Moderate AOE", "Large AOE"]

  let testMastery: Mastery = new Mastery();
  let rate: number = 0

  useEffect(() => {
    if (!active) setCost(0
  );
  }, [active]);

  if (!active) setCost(0);

  if (ParentMastery.getType() === testMastery.novice(true)) rate = 2;
  else if (ParentMastery.getType() === testMastery.intermediate(true))
    rate = 3;
  else if (ParentMastery.getType() === testMastery.mastered(true)) rate = 4;

  return (
    <>
      <div>
        <h1>Manna to Disruption</h1>
        <h3>DIRECT DAMAGE</h3>

        <h3>RANGE - DIRECT</h3>
        <br />
        <input
          type="number"
          min="0"
          step="1"
          value={cost}
          onChange={(e) => setCost(Number(e.target.value) * rate || 0)}
        />
        <br />
        <Select title="AOE" choices={sizes} changeChoice={()=>setSize}></Select>
      </div>
      <h3>Disruption: {cost * rate}</h3>
      <h3>Cost: {cost}</h3>
    </>
  );
};

export default AlterIntegrity;
