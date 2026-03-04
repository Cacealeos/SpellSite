import React, { useState, useEffect } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models/Potency";

const AugmentGravity = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState({
    base: 0,
    Power: 0,
    AOE: 0,
    Charge: 0,
    Cost: 0,
    Mod: 0,
    Damage: 0,
  });
  const [pot, setPot] = useState(new Potency());
  const [increments, setIncrement] = useState(0);

  let AOE = ["SMALL", "MODERATE", "LARGE", "MASSIVE"];
  let SpellPotency: Potency = new Potency();
  let testPotency: Potency = new Potency();
  let testMastery: Mastery = new Mastery();

  useEffect(() => {
    if (!active)
      setCost({
        base: 0,
        Power: 0,
        AOE: 0,
        Charge: 0,
        Cost: 0,
        Mod: 0,
        Damage: 0,
      });
  }, [active]);

  const changeChoice = (potency: string | void) => {
    if (ParentMastery.getType() === testMastery.novice(true)) {
      if (SpellPotency.getType() === testPotency.minor(true))
        setCost({
          base: 40,
          Power: 2,
          AOE: 0,
          Charge: 3,
          Cost: 90,
          Mod: 30,
          Damage: 10,
        });
      if (SpellPotency.getType() === testPotency.major(true))
        setCost({
          base: 80,
          Power: 3,
          AOE: 1,
          Charge: 5,
          Cost: 185,
          Mod: 42,
          Damage: 15,
        });
      if (SpellPotency.getType() === testPotency.extreme(true))
        setCost({
          base: 140,
          Power: 4,
          AOE: 2,
          Charge: 7,
          Cost: 330,
          Mod: 48,
          Damage: 20,
        });
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.intermediate(true)) {
      if (SpellPotency.getType() === testPotency.minor(true))
        setCost({
          base: 40,
          Power: 2,
          AOE: 0,
          Charge: 3,
          Cost: 75,
          Mod: 25,
          Damage: 10,
        });
      if (SpellPotency.getType() === testPotency.major(true))
        setCost({
          base: 80,
          Power: 3,
          AOE: 1,
          Charge: 5,
          Cost: 155,
          Mod: 35,
          Damage: 15,
        });
      if (SpellPotency.getType() === testPotency.extreme(true))
        setCost({
          base: 140,
          Power: 4,
          AOE: 2,
          Charge: 7,
          Cost: 280,
          Mod: 40,
          Damage: 20,
        });
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.mastered(true)) {
      if (SpellPotency.getType() === testPotency.minor(true))
        setCost({
          base: 40,
          Power: 2,
          AOE: 0,
          Charge: 3,
          Cost: 60,
          Mod: 20,
          Damage: 10,
        });
      if (SpellPotency.getType() === testPotency.major(true))
        setCost({
          base: 80,
          Power: 3,
          AOE: 1,
          Charge: 5,
          Cost: 125,
          Mod: 28,
          Damage: 15,
        });
      if (SpellPotency.getType() === testPotency.extreme(true))
        setCost({
          base: 140,
          Power: 4,
          AOE: 2,
          Charge: 7,
          Cost: 230,
          Mod: 32,
          Damage: 20,
        });
      setPot(SpellPotency);
    }
  };

  return (
    <>
      <div>
        <h1>Augment Gravity</h1>
        <br />
        <p>Potency</p>
        <div>
          <h2>Minor: 90 / 75 / 60</h2>
          <h3>Base: 40</h3>
          <h3>Power: 2</h3>
          <h3>AOE: SMALL</h3>
          <h3>Charge: 3</h3>
          <h3>Damage: +10</h3>
          <br />

          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.minor())}
          />
        </div>
        <div>
          <h2>Major: 185 / 155 / 125</h2>
          <h3>Base: 80</h3>
          <h3>Power: 3</h3>
          <h3>AOE: MODERATE</h3>
          <h3>Charge: 5</h3>
          <h3>Damage: +15</h3>
          <br />

          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.major())}
          />
        </div>
        <div>
          <h2>Extreme: 330 / 280 / 230</h2>
          <h3>Base: 140</h3>
          <h3>Power: 4</h3>
          <h3>AOE: LARGE</h3>
          <h3>Charge: 7</h3>
          <h3>Damage: +20</h3>
          <br />

          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.extreme())}
          />
        </div>
        <br />
        <div>
          <input
            type="number"
            step="1"
            min="0"
            max="3"
            value={increments}
            onChange={(e) => setIncrement(Number(e.target.value))}
          />
        </div>
        <br />
        <div>
          <span>Base: {cost.base + cost.Damage * increments}</span>
          <br />
          <span>Scaling: 0% / 50%</span>
          <br />
          <span>Power: {cost.Power + increments > 1 ? 1 : 0}</span>
          <br />
          <span>AOE: {increments > 1 ? AOE[cost.AOE + 1] : AOE[cost.AOE]}</span>
          <br />
          <span>Charge Time: {cost.Charge + increments > 1 ? 1 : 0}</span>
          <br />
          <span>GRAVITY DAMAGE</span>
          <br />
          <span>RANGE - RADIAL / CLOUD</span>
          <br />
          <span>COST: {cost.Cost + cost.Mod * increments}</span>
          <br />
        </div>
      </div>
    </>
  );
};

export default AugmentGravity;
