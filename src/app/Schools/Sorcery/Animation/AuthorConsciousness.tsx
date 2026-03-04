import React, { useState, useEffect } from "react";
import { Mastery } from "@/app/models";

const AuthorConsciousness = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [increment, setIncrement] = useState(0);

  let testMastery: Mastery = new Mastery();
  let cost: number = 0;

  useEffect(() => {
    if (!active) setIncrement(0);
  }, [active]);

  if (ParentMastery.getType() === testMastery.novice(true)) cost = 32;
  if (ParentMastery.getType() === testMastery.intermediate(true)) cost = 28;
  if (ParentMastery.getType() === testMastery.mastered(true)) cost = 24;

  return (
    <>
      <h1>Author Consciousness</h1>

      <div>
        <br />
        <div>
          <h1>Longevity |TURNS|</h1>
          <br />
          <input
            type="number"
            min="0"
            step="1"
            value={increment}
            onChange={(e) => setIncrement(Number(e.target.value))}
          />
        </div>
        <p>Cost: {cost * increment}</p>
      </div>
    </>
  );
};

export default AuthorConsciousness;
