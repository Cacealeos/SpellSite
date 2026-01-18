import React, { useState, useEffect } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models/Potency";
import { force } from "./ConjurationData";

const ConjureForce = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState(0);
  const [pot, setPot] = useState(new Potency());
  const [Element, setElement] = useState<Record<string, {}>>(force.Gas);

  let SpellPotency: Potency = new Potency();
  let testPotency: Potency = new Potency();
  let testMastery: Mastery = new Mastery();

  useEffect(() => {
    if (!active) setCost(0);
  }, [active]);

  function calculateCost(cost: number) {
    setCost(cost);
  }

  const changeChoice = (potency: string | void) => {
    if (ParentMastery.getType() === testMastery.novice(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) calculateCost(20);
      if (SpellPotency.getType() === testPotency.major(true)) calculateCost(30);
      if (SpellPotency.getType() === testPotency.extreme(true))
        calculateCost(40);
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.intermediate(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) calculateCost(10);
      if (SpellPotency.getType() === testPotency.major(true)) calculateCost(20);
      if (SpellPotency.getType() === testPotency.extreme(true))
        calculateCost(30);
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.mastered(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) calculateCost(1);
      if (SpellPotency.getType() === testPotency.major(true)) calculateCost(10);
      if (SpellPotency.getType() === testPotency.extreme(true))
        calculateCost(20);
      setPot(SpellPotency);
    }
  };

  return (
    <>
      <div>
        <h1>Conjure Element</h1>
        <br />
        <p>Mediums</p>
        <div>
          <button onClick={(e) => setElement({ Gas: force.Gas })}>Gas</button>
          <button onClick={(e) => setElement({ Solids: force.Solids })}>
            Solids
          </button>
          <button onClick={(e) => setElement({ Lightning: force.Fluids })}>
            Fluids
          </button>
          <button onClick={(e) => setElement({ Wind: force.Plasma })}>
            Plasma
          </button>
        </div>
        <br />
        <p>Potency</p>
        <br />
        <span>Potency Scales with Power, Cost, and AOE</span>
        <div>
          <p>Minor – 20 / 10 / 1</p>
          <br />
          <span>Power: 1</span>
          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.minor())}
          />
        </div>
        <div>
          <p>Major – 30 / 20 / 10</p>
          <br />
          <span>Power: 2</span>
          <br />
          <span>Small AOE</span>
          <br />
          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.major())}
          />
        </div>
        <div>
          <p>Extreme – 40 / 30 / 20</p>
          <br />
          <span>Power: 3</span>
          <br />
          <span>Moderate AOE</span>
          <br />
          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.extreme())}
          />
        </div>
        <br />
        <div>
          <p>{Object.keys(Element)[0]}</p>
          <br />
          <p>
            targets the environment to either, push, pull, shape, or shake
            matter. Environmental damage can be inflicted indirectly in this
            way.
          </p>
          <br />
          <p>
            Potential direct targets composed of the used element make
            Discipline check that scale with potency and receive +/- to rolls
            equal to power disparity.
          </p>
          <br />
          <ul>
            Can result in:
            <li>Action loss for targets. Does not stack.</li>
            <li>Lifting, relocating, or destroying susceptible targets.</li>
            <li>Interruption of attacks if used Defensively</li>
            <li>Intercept objects or Projectiles if used Defensively</li>
            <li>Reduce damage via obstruction if used Defensively</li>
            <li>DISARM save</li>
            <li>Intended to be played with situational awareness.</li>
            <li></li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default ConjureForce;
