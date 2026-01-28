import React, { useState, useEffect } from "react";
import { Mastery } from "@/app/models";
import { Potency } from "@/app/models/Potency";

const Constructs = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState(0);
  const [TTT, setTTT] = useState(0);
  const [vitality, setVitality] = useState(0);
  const [damage, setDamage] = useState(0);
  const [power, setPower] = useState(0);
  const [pot, setPot] = useState(new Potency());

  let SpellPotency: Potency = new Potency();
  let testPotency: Potency = new Potency();
  let testMastery: Mastery = new Mastery();

  let PowerRate: number = 0;
  let VitalityRate: number = 0;
  let DamageRate: number = 0;

  useEffect(() => {
    if (!active) setCost(0);
  }, [active]);

  if (ParentMastery.getType() == testMastery.novice()) {
    PowerRate = 6;
    DamageRate = 4;
    VitalityRate = 1;
  } else if (ParentMastery.getType() == testMastery.intermediate()) {
    PowerRate = 4;
    DamageRate = 3;
    VitalityRate = 0.5;
  } else if (ParentMastery.getType() == testMastery.mastered()) {
    PowerRate = 2;
    DamageRate = 2;
    VitalityRate = 0.25;
  }

  function calcuateDamage(value: number) {
    setDamage(value);
    calcuateTTT();
  }
  function calcuateVitality(value: number) {
    setVitality(value);
    calcuateTTT();
  }
  function calcuatePower(value: number) {
    setPower(value);
    calcuateTTT();
  }

  function calcuateTTT() {
    setTTT(power * PowerRate + vitality * VitalityRate + damage * DamageRate);
  }

  const changeChoice = (potency: string | void) => {
    if (ParentMastery.getType() === testMastery.novice(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) setCost(15);
      if (SpellPotency.getType() === testPotency.major(true)) setCost(45);
      if (SpellPotency.getType() === testPotency.extreme(true)) setCost(135);
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.intermediate(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) setCost(10);
      if (SpellPotency.getType() === testPotency.major(true)) setCost(30);
      if (SpellPotency.getType() === testPotency.extreme(true)) setCost(90);
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.mastered(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) setCost(5);
      if (SpellPotency.getType() === testPotency.major(true)) setCost(15);
      if (SpellPotency.getType() === testPotency.extreme(true)) setCost(45);
      setPot(SpellPotency);
    }
  };

  return (
    <>
      <div>
        <h1>Projections</h1>
        <br />
        <div>
          <span>Power & Enderance</span>
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
            value={power}
            onChange={(e) => calcuatePower(Number(e.target.value))}
          />
          <span>Manna to Damage</span>
          <br />
          <input
            type="number"
            min="0"
            max={power * 15 + 5}
            step="1"
            value={damage}
            onChange={(e) => calcuateDamage(Number(e.target.value))}
          />
          <span>Manna to Vitality</span>
          <br />
          <input
            type="number"
            min={power * 30}
            step="1"
            value={vitality}
            onChange={(e) => calcuateVitality(Number(e.target.value))}
          />
        </div>
        <span>Size & Form</span>
        <div>
          <p>Minor – 15 / 10 / 5</p>
          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.minor())}
          />
        </div>
        <div>
          <p>Major – 45 / 30 / 15</p>
          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.major())}
          />
        </div>
        <div>
          <p>Extreme – 135 / 90 / 45</p>
          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.extreme())}
          />
        </div>
        <br />
      </div>
    </>
  );
};

export default Constructs;
