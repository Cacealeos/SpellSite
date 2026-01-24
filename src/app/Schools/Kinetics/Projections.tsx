import React, { useState, useEffect } from "react";
import { Mastery } from "@/app/models";
import { Potency } from "@/app/models/Potency";

const Projections = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState(0);
  const [damage, setDamage] = useState(0);
  const [power, setPower] = useState(0);
  const [shape, setShape] = useState(1);
  const [pot, setPot] = useState(new Potency());

  let SpellPotency: Potency = new Potency();
  let testPotency: Potency = new Potency();
  let testMastery: Mastery = new Mastery();

  let PowerRate: number = 0;
  let DamageRate: number = 2;

  useEffect(() => {
    if (!active) setCost(0);
  }, [active]);

  if (ParentMastery.getType() == testMastery.novice()) {
    PowerRate = 10;
  } else if (ParentMastery.getType() == testMastery.intermediate())
    PowerRate = 7;
  else if (ParentMastery.getType() == testMastery.mastered()) PowerRate = 5;

  function calculateCost(value: number) {
    setCost(value * shape + power + damage);
  }

  function displayDamage() {
    let mult = 1;
    if (shape === 0.5) mult = 0.5;
    if (shape === 2) mult = 1.5;
    if (shape === 4) mult = 2;

    return damage * mult;
  }

  const changeChoice = (potency: string | void) => {
    if (ParentMastery.getType() === testMastery.novice(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) calculateCost(15);
      if (SpellPotency.getType() === testPotency.major(true)) calculateCost(30);
      if (SpellPotency.getType() === testPotency.extreme(true))
        calculateCost(45);
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.intermediate(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) calculateCost(10);
      if (SpellPotency.getType() === testPotency.major(true)) calculateCost(25);
      if (SpellPotency.getType() === testPotency.extreme(true))
        calculateCost(40);
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.mastered(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) calculateCost(5);
      if (SpellPotency.getType() === testPotency.major(true)) calculateCost(20);
      if (SpellPotency.getType() === testPotency.extreme(true))
        calculateCost(35);
      setPot(SpellPotency);
    }
  };

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
          <span>RANGE - MISSILE/MELEE</span>
          <br />
          <span>Manna to Power & Endurance</span>
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
            max={(power / PowerRate) * 25}
            step="1"
            value="0"
            onChange={(e) =>
              setDamage(Number(e.target.value) * DamageRate || 0)
            }
          />
        </div>
        <span>Shape Costs</span>
        <div>
          <p>Minor – 15 / 10 / 5</p>
          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.minor())}
          />
        </div>
        <div>
          <p>Major – 30 / 25 / 20</p>
          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.major())}
          />
        </div>
        <div>
          <p>Extreme – 45 / 40 / 35</p>
          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.extreme())}
          />
        </div>
        <br />
        <div>
          <h4>Size Multipliers</h4>
          <span>Tiny --- |Shape Cost x 1/2|Damage x 1/2|</span>
          <input type="radio" name="shape" onClick={(e) => setShape(0.25)} />
          <br />
          <span>Sizeable --- |Shape Cost x 1|Damage x 2|</span>
          <input type="radio" name="shape" onClick={(e) => setShape(1)} />
          <br />
          <span>Enormus --- |Shape Cost x 2|Damage x 3/2|</span>
          <input type="radio" name="shape" onClick={(e) => setShape(1.5)} />
          <br />
          <span>Gargantuan --- |Shape Cost x 4|Damage x 2|</span>
          <input type="radio" name="shape" onClick={(e) => setShape(2)} />
          <br />
        </div>
        <br />
        <p>Info: Damage = {displayDamage()}</p>
      </div>
    </>
  );
};

export default Projections;
