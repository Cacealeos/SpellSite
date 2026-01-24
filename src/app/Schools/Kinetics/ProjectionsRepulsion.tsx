import React, { useState, useEffect } from "react";
import { Mastery } from "@/app/models";
import { Potency } from "@/app/models/Potency";

const ProjectionsRepulsion = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState(0);
  const [damage, setDamage] = useState(0);
  const [pot, setPot] = useState(new Potency());

  let SpellPotency: Potency = new Potency();
  let testPotency: Potency = new Potency();
  let testMastery: Mastery = new Mastery();

  useEffect(() => {
    if (!active) setCost(0);
  }, [active]);

  function calculateCost(value: number) {
    setCost(value + damage);
  }

  const changeChoice = (size: number | void) => {
    if (ParentMastery.getType() === testMastery.novice(true)) {
      if (size === 1) calculateCost(0);
      if (size === 2) calculateCost(45);
      if (size === 3) calculateCost(180);
    }
    if (ParentMastery.getType() === testMastery.intermediate(true)) {
      if (size === 1) calculateCost(0);
      if (size === 2) calculateCost(35);
      if (size === 3) calculateCost(140);
    }
    if (ParentMastery.getType() === testMastery.mastered(true)) {
      if (size === 1) calculateCost(0);
      if (size === 2) calculateCost(25);
      if (size === 3) calculateCost(100);
    }
  };

  return (
    <>
      <div>
        <h1>Repulsion</h1>
        <br />
        <div>
          <span>Manna to Damagee</span>
          <br />
          <span>KINTEIC DAMAGE</span>
          <br />
          <span>RANGE - RADIAL</span>
          <br />
          <input
            type="number"
            min="0"
            step="1"
            value="0"
            onChange={(e) => setDamage(Number(e.target.value) || 0)}
          />
        </div>
        <div>
          <h4>AOE</h4>
          <span>Small --- 0 / 0 / 0 </span>
          <input type="radio" name="shape" onClick={(e) => changeChoice(1)} />
          <br />
          <span>Moderate --- 45 / 35 / 25</span>
          <input type="radio" name="shape" onClick={(e) => changeChoice(2)} />
          <br />
          <span>Large --- 180 / 140 / 100</span>
          <input type="radio" name="shape" onClick={(e) => changeChoice(3)} />
          <br />
        </div>
        <br />
      </div>
    </>
  );
};

export default ProjectionsRepulsion;
