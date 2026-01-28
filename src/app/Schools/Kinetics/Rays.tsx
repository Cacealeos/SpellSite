import React, { useState, useEffect } from "react";
import { Mastery } from "@/app/models";
import { Potency } from "@/app/models/Potency";

const Rays = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [damage, setDamage] = useState(0);
  const [power, setPower] = useState(0);

  let testMastery: Mastery = new Mastery();
  let PowerRate: number = 0;
  let DamageRate: number = 2;

  if (ParentMastery.getType() == testMastery.novice()) {
    PowerRate = 20;
  } else if (ParentMastery.getType() == testMastery.intermediate())
    PowerRate = 15;
  else if (ParentMastery.getType() == testMastery.mastered()) PowerRate = 10;

  function displayDamage() {
    let bonus = power * 5;

    return bonus + damage / 2;
  }

  function displayTTT() {
    return power + damage;
  }

  return (
    <>
      <div>
        <h1>Projections</h1>
        <br />
        <div>
          <span>Poower & Enderance & Damage</span>
          <br />
          <span>KINTEIC DAMAGE</span>
          <br />
          <span>RANGE - MISSILE</span>
          <br />
          <span>Manna to Power</span>
          <br />
          <input
            type="number"
            min="0"
            max="3"
            step="1"
            value="0"
            onChange={(e) => setPower(Number(e.target.value) * PowerRate || 0)}
          />
          <span>Manna to Damage</span>
          <br />
          <input
            type="number"
            min="0"
            max="100"
            step="1"
            value="0"
            onChange={(e) =>
              setDamage(Number(e.target.value) * DamageRate || 0)
            }
          />
        </div>
        <span>Damage Total: {displayDamage()}</span>
        <br />
        <span>TTT Total: {displayTTT()}</span>
      </div>
    </>
  );
};

export default Rays;
