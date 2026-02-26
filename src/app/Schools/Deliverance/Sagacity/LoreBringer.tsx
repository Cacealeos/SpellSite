import React, { useState, useEffect } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models/Potency";

const LoreBringer = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState(0);

  let SpellPotency: Potency = new Potency();
  let testMastery: Mastery = new Mastery();

  useEffect(() => {
    if (!active) setCost(0);
  }, [active]);

  const changeChoice = (potency: string | void) => {
    if (ParentMastery.getType() === testMastery.novice(true)) setCost(300);
    if (ParentMastery.getType() === testMastery.intermediate()) setCost(200);
    if (ParentMastery.getType() === testMastery.mastered()) setCost(100);
  };

  return (
    <>
      <div>
        <h1>Lore Bringer</h1>
        <br />
        <div>
          <p> 300 / 200 / 100</p>

          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.minor())}
          />
        </div>

        <br />
      </div>
    </>
  );
};

export default LoreBringer;
