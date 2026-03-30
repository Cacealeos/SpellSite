import React, { useState, useEffect } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models/Potency";
import Select from "@/app/Select";

const TransmuteSubstrate = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState(0);
  const [type, setType] = useState("Displacement");

  let types: string[] = ["Displacement", "Warp", "Obfuscation"];
  let Obfuscation: boolean = types.indexOf(type) > 1;
  let SpellPotency: Potency = new Potency();
  let testPotency: Potency = new Potency();
  let testMastery: Mastery = new Mastery();
  let rate: number = 0;

  useEffect(() => {
    if (!active) setCost(0);
  }, [active]);

  const changeChoice = (potency: string | void) => {
    if (ParentMastery.getType() === testMastery.novice(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) setCost(75);
      if (SpellPotency.getType() === testPotency.major(true))
        setCost(150 * (Obfuscation ? 2 : 1));
      if (SpellPotency.getType() === testPotency.extreme(true))
        setCost(300 * (Obfuscation ? 4 : 1));
    }
    if (ParentMastery.getType() === testMastery.intermediate(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) setCost(50);
      if (SpellPotency.getType() === testPotency.major(true))
        setCost(100 * (Obfuscation ? 2 : 1));
      if (SpellPotency.getType() === testPotency.extreme(true))
        setCost(200 * (Obfuscation ? 4 : 1));
    }
    if (ParentMastery.getType() === testMastery.mastered(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) setCost(25);
      if (SpellPotency.getType() === testPotency.major(true))
        setCost(50 * (Obfuscation ? 2 : 1));
      if (SpellPotency.getType() === testPotency.extreme(true))
        setCost(100 * (Obfuscation ? 4 : 1));
    }
  };

  return (
    <>
      <div>
        <div>
          <Select
            title="Type"
            choices={types}
            changeChoice={() => setType}
          ></Select>
          <h2>Potency</h2>
          <div>
            <p>Minor 75 / 50 / 25</p>

            <input
              type="checkbox"
              onChange={(e) => changeChoice(SpellPotency.minor())}
            />
          </div>
          <div>
            <p>
              Major {150 * (Obfuscation ? 2 : 1)} /{100 * (Obfuscation ? 2 : 1)}{" "}
              / {50 * (Obfuscation ? 2 : 1)}
            </p>
            <br />

            <input
              type="checkbox"
              onChange={(e) => changeChoice(SpellPotency.major())}
            />
          </div>
          <div>
            <p>
              Extreme {300 * (Obfuscation ? 4 : 1)} /
              {200 * (Obfuscation ? 4 : 1)} / {100 * (Obfuscation ? 4 : 1)}
            </p>
            <br />

            <input
              type="checkbox"
              onChange={(e) => changeChoice(SpellPotency.extreme())}
            />
          </div>
          <br />
        </div>

        <br />
      </div>
    </>
  );
};

export default TransmuteSubstrate;
