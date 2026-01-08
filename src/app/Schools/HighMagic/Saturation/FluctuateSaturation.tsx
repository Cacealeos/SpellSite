import React, { useState, useEffect } from "react";
import { Mastery } from "../../../models/Mastery";

const FluctuateSaturation = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState(0);
  const [power, setPower] = useState(0);
  const [damage, setDamage] = useState(0);
  let powerRate: number = 0;
  let damageRate: number = 0;
  let testMastery: Mastery = new Mastery();

  useEffect(() => {
    if (!active) setCost(0);
  }, [active]);

  if (ParentMastery.getType() === testMastery.novice(true)) {
    powerRate = 12;
    damageRate = 5;
  } else if (ParentMastery.getType() === testMastery.intermediate(true)) {
    powerRate = 10;
    damageRate = 4;
  } else if (ParentMastery.getType() === testMastery.mastered(true)) {
    powerRate = 8;
    damageRate = 3;
  }

  function caculatePowerCost(pow: number) {
    setPower(pow);
    setDamage(damage + pow * 5); //bonus damage from power
    pow *= powerRate || 0;
    setCost(pow + damage * damageRate);
  }

  function caculateDamageCost(dam: number) {
    setDamage(dam + power * 5); //bonus damage from power
    dam *= damageRate || 0;
    setCost(dam + power * powerRate);
  }

  return (
    <>
      <h1>Fluctuate Saturation</h1>
      <p>
        Info: Attack with animated Ether and Ethereal. Fluctuate Saturation
        affects Saturation at a heavy rate
      </p>
      <br />
      <p>Power of Fluctuate Saturation peaks at 5 |7 with SPELL CHARGE|</p>
      <div>
        <h1>Manna to Power</h1>
        <br />
        <input
          type="number"
          max="5"
          min="0"
          step="1"
          value="0"
          onChange={(e) => caculatePowerCost(Number(e.target.value))}
        />
        <br />
      </div>
      <div>
        <h1>Manna to Damage</h1>
        <br />
        <input
          type="number"
          max="200"
          min="0"
          step="1"
          value="0"
          onChange={(e) => caculateDamageCost(Number(e.target.value))}
        />
        <br />
      </div>
      <div>
        <p>Kinetic</p>
        <br />
        <p>RANGE - MISSLE / CLOUD</p>
        <br />
        <p>Recieves bonus damage from power |5|</p>
        <br />
        <p>
          Fluctuate Saturation has Saturation MODERATE threshold. And becomes
          unusable at HIGH Saturation. |40%+|
        </p>
        <span>Damage: {damage}</span>
      </div>
    </>
  );
};

export default FluctuateSaturation;
