import React, { useState, useEffect } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models/Potency";

const TransmutePart = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
    const [power, setPower] = useState(0);
     const [damage, setDamage] = useState(0);
  const [cost, setCost] = useState(0);
  const [pot, setPot] = useState(new Potency());

  let testMastery: Mastery = new Mastery();
  let rates: number[] = [0,0];

  useEffect(() => {
    if (!active) setCost(0);
  }, [active]);

  if (ParentMastery.getType() == testMastery.novice()) rates = [25,6,150];
  else if (ParentMastery.getType() == testMastery.intermediate()) rates = [20,5,120];
  else if (ParentMastery.getType() == testMastery.mastered()) rates = [15,4,90];

  return (
    <>
      <div>

        <h3>EXPLOSIVE DAMAGE</h3>
        <h3>RANGE - RADIAL</h3>
        <h3>Scaling: 0 / 33%</h3>
    
        <h1>Manna to Power</h1>
        <br />
        <input
          type="number"
          min="5"
          max="8"
          step="1"
          value={power}
          onChange={(e) => setPower(Number(e.target.value))}
        />
        <br />
        <h1>Manna to Damage</h1>
        <br />
        <input
          type="number"
          min="0"
          step="1"
          value={damage}
          onChange={(e) => setDamage(Number(e.target.value))}
        />
        <br />

        <h3>Cost: {rates[2] + rates[1]*damage + rates[0] * (power-5)}</h3>
        <h3>Damage: {damage + 150}</h3>
                <h3>Power: {power}</h3>

        
      </div>
    </>
  );
};

export default TransmutePart;
