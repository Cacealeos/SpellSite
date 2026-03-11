import React, { useState, useEffect } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models/Potency";
import Select from "@/app/Select";

const ManifestProxy = ({
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

  if (ParentMastery.getType() === testMastery.novice(true)) rate = 10;
  else if (ParentMastery.getType() === testMastery.intermediate(true))
    rate = 5;
  else if (ParentMastery.getType() === testMastery.mastered(true)) rate = 0;

  return (
    <>
      <div>
        <h1>Manna to Turns</h1>
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
      <h3>Turns = {cost}</h3>
      <h3>Cost = {cost * rate}</h3>
    </>
  );
};

export default ManifestProxy;
