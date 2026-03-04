import React, { useState, useEffect } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models/Potency";

const AugmentParticle = ({
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
          base: 60,
          Power: 3,
          AOE: 0,
          Charge: 3,
          Cost: 96,
          Mod: 30,
          Damage: 15,
        });
      if (SpellPotency.getType() === testPotency.major(true))
        setCost({
          base: 125,
          Power: 4,
          AOE: 1,
          Charge: 5,
          Cost: 225,
          Mod: 48,
          Damage: 20,
        });
      if (SpellPotency.getType() === testPotency.extreme(true))
        setCost({
          base: 215,
          Power: 6,
          AOE: 2,
          Charge: 7,
          Cost: 425,
          Mod: 60,
          Damage: 25,
        });
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.intermediate(true)) {
      if (SpellPotency.getType() === testPotency.minor(true))
        setCost({
          base: 60,
          Power: 3,
          AOE: 0,
          Charge: 3,
          Cost: 80,
          Mod: 25,
          Damage: 15,
        });
      if (SpellPotency.getType() === testPotency.major(true))
        setCost({
          base: 125,
          Power: 4,
          AOE: 1,
          Charge: 5,
          Cost: 185,
          Mod: 40,
          Damage: 20,
        });
      if (SpellPotency.getType() === testPotency.extreme(true))
        setCost({
          base: 215,
          Power: 6,
          AOE: 2,
          Charge: 7,
          Cost: 355,
          Mod: 50,
          Damage: 25,
        });
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.mastered(true)) {
      if (SpellPotency.getType() === testPotency.minor(true))
        setCost({
          base: 60,
          Power: 3,
          AOE: 0,
          Charge: 3,
          Cost: 64,
          Mod: 20,
          Damage: 15,
        });
      if (SpellPotency.getType() === testPotency.major(true))
        setCost({
          base: 125,
          Power: 4,
          AOE: 1,
          Charge: 5,
          Cost: 145,
          Mod: 32,
          Damage: 20,
        });
      if (SpellPotency.getType() === testPotency.extreme(true))
        setCost({
          base: 215,
          Power: 6,
          AOE: 2,
          Charge: 7,
          Cost: 285,
          Mod: 40,
          Damage: 25,
        });
      setPot(SpellPotency);
    }
  };

  return (
    <>
      <div>
        <h1>Augment Entropy or Magnetism</h1>
        <br />
        <p>Potency</p>
        <div>
          <h2>Minor: 96 / 80 / 64</h2>
          <h3>Base: 60</h3>
          <h3>Power: 3</h3>
          <h3>AOE: SMALL</h3>
          <h3>Charge: 3</h3>
          <h3>Damage Mod: +15</h3>
          <br />

          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.minor())}
          />
        </div>
        <div>
          <h2>Major: 225 / 185 / 145</h2>
          <h3>Base: 100</h3>
          <h3>Power: 4</h3>
          <h3>AOE: MODERATE</h3>
          <h3>Charge: 5</h3>
          <h3>Damage Mod: +20</h3>
          <br />

          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.major())}
          />
        </div>
        <div>
          <h2>Extreme: 425 / 355 / 285</h2>
          <h3>Base: 175</h3>
          <h3>Power: 6</h3>
          <h3>AOE: LARGE</h3>
          <h3>Charge: 7</h3>
          <h3>Damage Mod: +25</h3>
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
          <span>Scaling: 0% / 25%</span>
          <br />
          <span>Power: {cost.Power + increments > 1 ? 1 : 0}</span>
          <br />
          <span>AOE: {increments > 1 ? AOE[cost.AOE + 1] : AOE[cost.AOE]}</span>
          <br />
          <span>Charge Time: {cost.Charge + increments > 1 ? 1 : 0}</span>
          <br />
          <span>EXPLOSIVE OR ELECTRIC DAMAGE</span>
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

export default AugmentParticle;
