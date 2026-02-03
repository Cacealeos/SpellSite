import React, { useState, useEffect } from "react";
import { Mastery } from "@/app/models";
import { Potency } from "@/app/models/Potency";

const Fields = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState(0);
  const [total, setTotal] = useState(0);
  const [damage, setDamage] = useState(0);
  const [power, setPower] = useState(0);
  const [pot, setPot] = useState(new Potency());

  let testMastery: Mastery = new Mastery();

  let PowerRate: number = 0;
  let damageRate: number = 0;

  useEffect(() => {
    if (!active) setCost(0);
  }, [active]);

  if (ParentMastery.getType() == testMastery.novice()) {
    PowerRate = 15;
    damageRate = 4;
  } else if (ParentMastery.getType() == testMastery.intermediate()) {
    PowerRate = 12;
    damageRate = 3;
  } else if (ParentMastery.getType() == testMastery.mastered()) {
    PowerRate = 10;
    damageRate = 2;
  }

  const changeChoice = (size: number) => {
    if (size === 1) setCost(0);
    else if (size === 2) {
      if (ParentMastery.getType() === testMastery.novice(true)) {
        setCost(45);
      } else if (ParentMastery.getType() === testMastery.intermediate(true)) {
        setCost(35);
      } else if (ParentMastery.getType() === testMastery.mastered(true)) {
        setCost(25);
      }
    } else if (size === 3) {
      if (ParentMastery.getType() === testMastery.novice(true)) {
        setCost(180);
      } else if (ParentMastery.getType() === testMastery.intermediate(true)) {
        setCost(140);
      } else if (ParentMastery.getType() === testMastery.mastered(true)) {
        setCost(100);
      }
    }
  };

  return (
    <>
      <div>
        <h1>Fields</h1>
        <br />
        <div>
          <span>Manna to Power</span>
          <br />
          <input
            type="number"
            min="0"
            max="3"
            step="1"
            value={power}
            onChange={(e) => setPower(Number(e.target.value))}
          />

          <span>Manna to Damage</span>
          <br />
          <input
            type="number"
            min={power * 25 + 5}
            step="1"
            value={damage}
            onChange={(e) => setDamage(Number(e.target.value))}
          />
        </div>
        <span>Range</span>
        <div>
          <p>Small AOE</p>
          <input type="checkbox" onChange={(e) => changeChoice(1)} />
        </div>
        <div>
          <p>Moderate AOE</p>
          <input type="checkbox" onChange={(e) => changeChoice(2)} />
        </div>
        <div>
          <p>Large AOE</p>
          <input type="checkbox" onChange={(e) => changeChoice(3)} />
        </div>
        <br />
        <span>Total: {cost + damage * damageRate + power * PowerRate}</span>
      </div>
    </>
  );
};

export default Fields;
