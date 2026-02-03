import React, { useState, useEffect } from "react";
import { Mastery } from "@/app/models";
import { Potency } from "@/app/models/Potency";

const SealMetaphysical = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState(0);
  const [power, setPower] = useState(0);
  const [pot, setPot] = useState(new Potency());

  let SpellPotency: Potency = new Potency();
  let testPotency: Potency = new Potency();
  let testMastery: Mastery = new Mastery();

  useEffect(() => {
    if (!active) setCost(0);
  }, [active]);

  const changeChoice = (potency: string | void) => {
    if (ParentMastery.getType() === testMastery.novice(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) {
        setCost(40);
        setPower(1);
      }
      if (SpellPotency.getType() === testPotency.major(true)) {
        setCost(70);
        setPower(1);
      }
      if (SpellPotency.getType() === testPotency.extreme(true)) {
        setCost(100);
        setPower(1);
      }
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.intermediate(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) {
        setCost(30);
        setPower(1);
      }
      if (SpellPotency.getType() === testPotency.major(true)) {
        setCost(60);
        setPower(1);
      }
      if (SpellPotency.getType() === testPotency.extreme(true)) {
        setCost(90);
        setPower(1);
      }
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.mastered(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) {
        setCost(20);
        setPower(1);
      }
      if (SpellPotency.getType() === testPotency.major(true)) {
        setCost(50);
        setPower(1);
      }
      if (SpellPotency.getType() === testPotency.extreme(true)) {
        setCost(80);
        setPower(1);
      }
      setPot(SpellPotency);
    }
  };

  return (
    <>
      <div>
        <h1>Recall Seal</h1>
        <br />

        <span>Potency</span>
        <div>
          <p>Minor – 40 / 30 / 20</p>
          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.minor())}
          />
        </div>
        <div>
          <p>Major – 70 / 60 / 50</p>
          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.major())}
          />
        </div>
        <div>
          <p>Extreme – 100 / 90 / 80</p>
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

export default SealMetaphysical;
