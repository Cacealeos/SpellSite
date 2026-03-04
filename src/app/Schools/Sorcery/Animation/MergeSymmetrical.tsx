import React, { useState, useEffect } from "react";
import { Mastery } from "@/app/models";

const MergeSymmetrical = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState(0);
  const [increment, setIncrement] = useState(0);

  let testMastery: Mastery = new Mastery();

  useEffect(() => {
    if (!active) setCost(0);
  }, [active]);

  if (ParentMastery.getType() === testMastery.novice(true)) setCost(1);
  if (ParentMastery.getType() === testMastery.intermediate(true)) setCost(0.5);
  if (ParentMastery.getType() === testMastery.mastered(true)) setCost(0);

  return (
    <>
      <div>
        <h1>Merge Symmetrical</h1>

        <br />
      </div>
      <div>
        <br />
        <div>
          <h1>Cost</h1>
          <br />
          <input
            type="number"
            min="0"
            step="1"
            value={increment}
            onChange={(e) => setIncrement(Number(e.target.value))}
          />
        </div>
        <p>TTT: {cost * increment}</p>
      </div>
    </>
  );
};

export default MergeSymmetrical;
