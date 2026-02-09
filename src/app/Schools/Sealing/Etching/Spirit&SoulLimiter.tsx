import React, { useState, useEffect } from "react";
import { Mastery } from "@/app/models";
import { Potency } from "@/app/models/Potency";

const SpiritSoulLimiter = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [currentIncrement, setCurrentIncrement] = useState(0);
  const [maxIncrement, setMaxIncrement] = useState(0);
  const [threshold, setThreshold] = useState(0);

  let SpellPotency: Potency = new Potency();
  let testPotency: Potency = new Potency();

  //   useEffect(() => {
  //     if (!active) setCost(0);
  //   }, [active]);

  const changeChoice = (potency: string | void) => {
    if (SpellPotency.getType() === testPotency.minor()) {
      setMaxIncrement(5);
      setThreshold(50);
    } else if (SpellPotency.getType() === testPotency.major()) {
      setMaxIncrement(8);
      setThreshold(80);
    } else if (SpellPotency.getType() === testPotency.extreme()) {
      setMaxIncrement(11);
      setThreshold(100);
    }
  };

  return (
    <>
      <div>
        <h1>Spirit or Soul Limiter</h1>
        <br />
        <p>DIRECT DAMAGE</p>
        <br />
        <span>Potency</span>
        <div>
          <p>Minor</p>
          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.minor())}
          />
        </div>
        <div>
          <p>Major</p>
          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.major())}
          />
        </div>
        <div>
          <p>Extreme</p>
          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.extreme())}
          />
        </div>
        <br />
      </div>
      <div>
        <h1>Set Seal Values</h1>
        <br />
        <div>
          <span> Drain Increment</span>
          <br />
          <input
            type="number"
            min="0"
            max={maxIncrement}
            step="1"
            value={currentIncrement}
            onChange={(e) => setCurrentIncrement(Number(e.target.value))}
          />
        </div>
        <p>
          Spirit or Soul will drain until Maximum of {threshold} is depleted
        </p>
      </div>
    </>
  );
};

export default SpiritSoulLimiter;
