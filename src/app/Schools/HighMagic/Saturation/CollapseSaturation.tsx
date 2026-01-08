import React, { useState, useEffect } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "../../../models/Potency";

const CollapseSaturation = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState(0);
  const [damage, setDamage] = useState(0);
  const [pot, setPot] = useState(new Potency());
  const [TTT, setTTT] = useState(0);

  let SpellPotency: Potency = pot;
  let testPotency: Potency = new Potency();
  let testMastery: Mastery = new Mastery();

  useEffect(() => {
    if (!active) setCost(0);
  }, [active]);

  const changeChoice = (potency: string | void) => {
    if (ParentMastery.getType() === testMastery.novice(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) {
        setCost(90);
      }
      if (SpellPotency.getType() === testPotency.major(true)) setCost(60);
      if (SpellPotency.getType() === testPotency.extreme(true)) setCost(30);
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.intermediate(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) setCost(200);
      if (SpellPotency.getType() === testPotency.major(true)) setCost(150);
      if (SpellPotency.getType() === testPotency.extreme(true)) setCost(100);
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.mastered(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) setCost(500);
      if (SpellPotency.getType() === testPotency.major(true)) setCost(400);
      if (SpellPotency.getType() === testPotency.extreme(true)) setCost(300);
      setPot(SpellPotency);
    }
  };

  function caculateDamageCost(damage: number, rate: number) {
    setDamage(rate);
    setTTT(rate * damage);
  }

  return (
    <>
      <h1>Collapse Saturation</h1>
      <h2>Info</h2>
      <p>
        Collect and pool a mass of saturated manna into a construct to be
        weaponized by collapsing the Saturation into Ether or Ethereal,
        releasing great energy. Positioning and Orientation of the collective is
        caster dependent and dynamic
      </p>
      <br />
      <b>Large AOE.</b>
      <br />
      <p>
        Power scales with the amount of Saturation. Every 10% provides 1 power.
        |Max 6|
      </p>
      <br />
      <b>Collectives Power / Endurance matches the Saturation Scaling</b>
      <br />
      <p>
        Vitality of the collective prevents the interruption/premature
        detonation of the Collapse Saturation mass
      </p>
      <br />
      <p>
        Damage starts at 0 and scales with invested TTT cost into strike.
        Invested TTT depreciates by 10 every turn not charged. Collective cannot
        be detonated with less than 10 invested TTT
      </p>
      <br />
      <p>Potency Scales with:</p>
      <ul>
        <li>
          Vitality |Base + additional manna to Vitality ratio of 1:1|
          <li>Base cost</li>
          <li>TTT Damage to manna ratio.</li>
          <li>
            <b>Mastery also improves Vitality</b>
          </li>
        </li>
      </ul>
      <br />
      <p>KINETIC</p>
      <br />
      <p>RANGE - RADIAL</p>
      <br />
      <b>
        Fluctuate Saturation has moderate Saturation threshold. And becomes
        unusable at HIGH Saturation. |40%+|
      </b>
      <div>
        <h1>
          <button onClick={() => changeChoice(testPotency.minor(true))}>
            MINOR
          </button>
        </h1>

        <ol>
          <li>Base Cost - 90 / 60 / 30</li>
          <li>Vitality - | 50 / 100 / 150 | + X</li>
          <li>TTT to damage: 2 TO 1</li>
        </ol>
        <input
          type="number"
          min="0"
          value={damage}
          onChange={(e) => caculateDamageCost(Number(e.target.value), 2)}
          disabled={SpellPotency.getType() === testPotency.minor(true)}
        />
        <br />
      </div>

      <div>
        <h1>
          <button onClick={() => changeChoice(testPotency.major(true))}>
            MAJOR
          </button>
        </h1>
        <br />
        <ol>
          <li>Base Cost - 200 / 150 / 100</li>
          <li>Vitality - | 200 / 300 / 400 | + X</li>
          <li>TTT to damage: 1 TO 1</li>
        </ol>
        <input
          type="number"
          min="0"
          value={damage}
          onChange={(e) => caculateDamageCost(Number(e.target.value), 2)}
          disabled={SpellPotency.getType() === testPotency.major(true)}
        />
        <br />
      </div>
      <div>
        <h1>
          <button onClick={() => changeChoice(testPotency.extreme(true))}>
            EXTREME
          </button>
        </h1>
        <br />
        <ol>
          <li>Base Cost - 500 / 400 / 300</li>
          <li>Vitality - | 500 / 700 / 900 | + X</li>
          <li>TTT to damage: 1 TO 2</li>
        </ol>
        <input
          type="number"
          min="0"
          step="1"
          value={damage}
          onChange={(e) => caculateDamageCost(Number(e.target.value), 0.5)}
          disabled={SpellPotency.getType() === testPotency.extreme(true)}
        />
        <br />
      </div>
    </>
  );
};

export default CollapseSaturation;
