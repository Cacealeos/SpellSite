import React, { useState, useEffect } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models/Potency";
import Select from "@/app/Select";

const TransmuteCacealeos = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState(0);
  const [type, setType] = useState("Prism");

  const Types: string[] = ["Prism", "Law", "Reinforcement", "Junction"];
  const isJunction = type === "Junction";
  let display: { display: string } = {
    display: isJunction ? "block" : "none",
  };
  let SpellPotency: Potency = new Potency();
  let testPotency: Potency = new Potency();
  let testMastery: Mastery = new Mastery();

  useEffect(() => {
    if (!active) setCost(0);
  }, [active]);

  const changeChoice = (potency: string | void) => {
    if (ParentMastery.getType() === testMastery.novice(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) setCost(75);
      if (SpellPotency.getType() === testPotency.major(true)) setCost(150);
      if (SpellPotency.getType() === testPotency.extreme(true)) setCost(300);
    }
    if (ParentMastery.getType() === testMastery.intermediate(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) setCost(50);
      if (SpellPotency.getType() === testPotency.major(true)) setCost(100);
      if (SpellPotency.getType() === testPotency.extreme(true)) setCost(200);
    }
    if (ParentMastery.getType() === testMastery.mastered(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) setCost(25);
      if (SpellPotency.getType() === testPotency.major(true)) setCost(50);
      if (SpellPotency.getType() === testPotency.extreme(true)) setCost(100);
    }
  };

  return (
    <>
      <div>
        <div>
          <Select
            title="Types"
            choices={Types}
            changeChoice={() => setType}
          ></Select>
          <div style={display}>
            <h2>Potency</h2>
            <p>Minor 75 / 50 / 25</p>

            <input
              type="checkbox"
              onChange={(e) => changeChoice(SpellPotency.minor())}
            />
          </div>
          <div>
            <p>Major 150 / 100 / 50</p>
            <br />

            <input
              type="checkbox"
              onChange={(e) => changeChoice(SpellPotency.major())}
            />
          </div>
          <div>
            <p>Extreme 300 / 200 / 100</p>
            <br />

            <input
              type="checkbox"
              onChange={(e) => changeChoice(SpellPotency.extreme())}
            />
          </div>
          <br />
        </div>
      </div>
    </>
  );
};

export default TransmuteCacealeos;
