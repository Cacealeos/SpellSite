import React, { useState, useEffect } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models/Potency";

const RejuvenateMemory = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [memory, setMemory] = useState(0);

  let rate: number = 0;

  useEffect(() => {
    if (!active) setMemory(0);
  }, [active]);

  return (
    <>
      <div>
        <h1>Rejuvenate Memory</h1>
        <br />
        <h2>Clairty</h2>
        <input
          type="check"
          min="0"
          step="1"
          value="0"
          onChange={(e) => setMemory(1)}
        />
        <br />
        <h2>Solidarity</h2>
        <input
          type="check"
          min="0"
          step="1"
          value="0"
          onChange={(e) => setMemory(2)}
        />
        <br />
        <h2>Posterity</h2>
        <input
          type="check"
          min="0"
          step="1"
          value="0"
          onChange={(e) => setMemory(3)}
        />
        <br />
        <p>Cost: 100 Manna. |No Potency or Mastery|</p>
        <span>{memory === 1 && "Clairty"}</span>
        <span>{memory === 2 && "Solidarity"}</span>
        <span>{memory === 3 && "Posterity"}</span>
      </div>
    </>
  );
};

export default RejuvenateMemory;
