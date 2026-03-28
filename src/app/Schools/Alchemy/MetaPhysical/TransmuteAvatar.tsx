import React, { useState, useEffect } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models/Potency";

const TransmuteAvatar = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState({ cost: 0, SpellCraft: 0, MageTech: 0 });
  const [pot, setPot] = useState(new Potency());

  let SpellPotency: Potency = new Potency();
  let testPotency: Potency = new Potency();
  let testMastery: Mastery = new Mastery();

  useEffect(() => {
    if (!active) setCost({ cost: 0, SpellCraft: 0, MageTech: 0 });
  }, [active]);

  function calculateCost(change: {
    cost: number;
    SpellCraft: number;
    MageTech: number;
  }) {
    setCost(change);
  }

  const changeChoice = (potency: string | void) => {
    if (ParentMastery.getType() === testMastery.novice(true)) {
      if (SpellPotency.getType() === testPotency.minor(true))
        calculateCost({ cost: 20, SpellCraft: 2, MageTech: 75 });
      if (SpellPotency.getType() === testPotency.major(true))
        calculateCost({ cost: 60, SpellCraft: 3, MageTech: 100 });
      if (SpellPotency.getType() === testPotency.extreme(true))
        calculateCost({ cost: 100, SpellCraft: 4, MageTech: 125 });
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.intermediate(true)) {
      if (SpellPotency.getType() === testPotency.minor(true))
        calculateCost({ cost: 10, SpellCraft: 2, MageTech: 75 });
      if (SpellPotency.getType() === testPotency.major(true))
        calculateCost({ cost: 40, SpellCraft: 3, MageTech: 100 });
      if (SpellPotency.getType() === testPotency.extreme(true))
        calculateCost({ cost: 80, SpellCraft: 4, MageTech: 125 });
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.mastered(true)) {
      if (SpellPotency.getType() === testPotency.minor(true))
        calculateCost({ cost: 0, SpellCraft: 2, MageTech: 75 });
      if (SpellPotency.getType() === testPotency.major(true))
        calculateCost({ cost: 20, SpellCraft: 3, MageTech: 100 });
      if (SpellPotency.getType() === testPotency.extreme(true))
        calculateCost({ cost: 60, SpellCraft: 4, MageTech: 125 });
      setPot(SpellPotency);
    }
  };

  return (
    <>
      <div>
        <h1>Transmute Avatar</h1>
        <br />
        <p>Potency</p>
        <div>
          <p>Minor 20 / 10 / 0</p>

          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.minor())}
          />
        </div>
        <div>
          <p>Major 60 / 40 / 20</p>
          <br />

          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.major())}
          />
        </div>
        <div>
          <p>Extreme 100 / 80 / 60</p>
          <br />

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

export default TransmuteAvatar;
