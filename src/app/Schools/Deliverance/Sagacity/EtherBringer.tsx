import React, { useState, useEffect } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models/Potency";

const EtherBringer = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState(0);

  let rate: number = 0;

  useEffect(() => {
    if (!active) setCost(0);
  }, [active]);

  return (
    <>
      <div>
        <h1>Ether Bringer</h1>
        <br />

        <div>
          <p>6/1 | 4/1 | 2/1</p>

          <input
            type="number"
            min="0"
            step="1"
            value={cost}
            onChange={(e) => setCost(Number(e.target.value))}
          />
        </div>

        <br />
        <h3>TTT: {cost * rate}</h3>
      </div>
    </>
  );
};

export default EtherBringer;
