import React, { useState, useEffect } from "react";
import { Mastery } from "../../../models/Mastery";

const TransmuteGravity = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [power, setPower] = useState(0);
  const [damage, setDamage] = useState(0);

  let testMastery: Mastery = new Mastery();
  let rates: number[] = [0, 0];

  useEffect(() => {
    if (!active) {
      setPower(0);
      setDamage(0);
    }
  }, [active]);

  if (ParentMastery.getType() === testMastery.novice(true)) rates = [40, 6];
  else if (ParentMastery.getType() === testMastery.intermediate(true))
    rates = [35, 5];
  else if (ParentMastery.getType() === testMastery.mastered(true))
    rates = [30, 4];

  return (
    <>
      <div>
        <h1>Transmute Gravity</h1>
        <h2>Power</h2>
        <br />
        <input
          type="number"
          min="0"
          max="8"
          step="1"
          value={power}
          onChange={(e) => setPower(Number(e.target.value) * rates[0] || 0)}
        />
        <h2>Damage</h2>
        <input
          type="number"
          min="0"
          step="1"
          value={damage}
          onChange={(e) => setDamage(Number(e.target.value) * rates[0] || 0)}
        />
        <br />
      </div>
      <h3>GRAVITY</h3>
      <h3>RANGE - RADIAL</h3>
      <h3>
        AOE - {power > 6 ? (power > 8 ? "Massive" : "Large") : "Moderate"}
      </h3>

      <h2>Secondary</h2>
      <div>
        <h3>GRAVITY</h3>
        <h3>RANGE - RADIAL</h3>
        <h3>AOE - Moderate</h3>
        <h3>Check: {power * 2} vs Res OR Dis</h3>
      </div>
    </>
  );
};

export default TransmuteGravity;
