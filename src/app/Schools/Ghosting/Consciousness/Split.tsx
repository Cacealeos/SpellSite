import React, { useState, useEffect } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models/Potency";

const Split = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState(0);
  const [pot, setPot] = useState(new Potency ())

  useEffect(() => {
    if (!active) setCost(0);
  }, [active]);

  return (
    <>
      <div>
        <h1>Split</h1>
        
        <input
          type="number"
          max="1000"
          min="150"
          value={cost}
            onChange={(e) => setCost(Number(e.target.value))}
        />
        <br />
      </div>
      <h2>Cost: {cost}</h2>

    </>
  );
};

export default Split;
