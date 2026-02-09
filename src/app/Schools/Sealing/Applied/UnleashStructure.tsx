import React, { useState, useEffect } from "react";
import { Mastery } from "@/app/models";
import { Potency } from "@/app/models/Potency";

const UnleashStructure = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [TTT, setTTT] = useState(0);

  let SpellPotency: Potency = new Potency();
  let testPotency: Potency = new Potency();
  let testMastery: Mastery = new Mastery();

  //   useEffect(() => {
  //     if (!active) setCost(0);
  //   }, [active]);

  const changeChoice = (potency: string | void) => {
    if ((potency = testPotency.minor())) {
      if (ParentMastery.getType() === testMastery.novice(true)) {
        setTTT(15);
      } else if (ParentMastery.getType() === testMastery.intermediate(true)) {
        setTTT(10);
      } else if (ParentMastery.getType() === testMastery.mastered(true)) {
        setTTT(5);
      }
    } else if ((potency = testPotency.major())) {
      if (ParentMastery.getType() === testMastery.novice(true)) {
        setTTT(30);
      } else if (ParentMastery.getType() === testMastery.intermediate(true)) {
        setTTT(20);
      } else if (ParentMastery.getType() === testMastery.mastered(true)) {
        setTTT(10);
      }
    } else if ((potency = testPotency.extreme())) {
      if (ParentMastery.getType() === testMastery.novice(true)) {
        setTTT(60);
      } else if (ParentMastery.getType() === testMastery.intermediate(true)) {
        setTTT(40);
      } else if (ParentMastery.getType() === testMastery.mastered(true)) {
        setTTT(20);
      }
    }
  };
  return (
    <>
      <div>
        <h1>Unleash Structure</h1>

        <br />
        <span>Potency|TTT|</span>
        <div>
          <p>Minor</p>
          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.minor())}
          />
        </div>
        <div>
          <p>Major</p>
          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.major())}
          />
        </div>
        <div>
          <p>Extreme</p>
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

export default UnleashStructure;
