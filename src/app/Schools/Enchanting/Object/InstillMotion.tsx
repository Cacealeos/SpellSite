import React, { useState } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models/Potency";

const InstillMotion = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState(0);
  const [pot, setPot] = useState(new Potency());

  let MotionPotency: Potency = new Potency();
  let testPotency: Potency = new Potency();
  let testMastery: Mastery = new Mastery();

  if (!active) setCost(0);

  const changeChoice = (potency: string | void) => {
    if (ParentMastery.getType() === testMastery.novice(true)) {
      if (MotionPotency.getType() === testPotency.minor(true)) setCost(20);
      if (MotionPotency.getType() === testPotency.major(true)) setCost(40);
      if (MotionPotency.getType() === testPotency.extreme(true)) setCost(60);
      setPot(MotionPotency);
    }
    if (ParentMastery.getType() === testMastery.intermediate(true)) {
      if (MotionPotency.getType() === testPotency.minor(true)) setCost(15);
      if (MotionPotency.getType() === testPotency.major(true)) setCost(35);
      if (MotionPotency.getType() === testPotency.extreme(true)) setCost(55);
      setPot(MotionPotency);
    }
    if (ParentMastery.getType() === testMastery.mastered(true)) {
      if (MotionPotency.getType() === testPotency.minor(true)) setCost(10);
      if (MotionPotency.getType() === testPotency.major(true)) setCost(30);
      if (MotionPotency.getType() === testPotency.extreme(true)) setCost(50);
      setPot(MotionPotency);
    }
  };

  return (
    <>
      <div>
        <h1>Instill Motion</h1>
        <br />
        <p>Potency</p>
        <div>
          <p>Minor – 20 / 15 / 10</p>
          <input
            type="checkbox"
            onChange={(e) => changeChoice(MotionPotency.minor())}
          />
        </div>
        <div>
          <p>Major – 40 / 35 / 30</p>
          <input
            type="checkbox"
            onChange={(e) => changeChoice(MotionPotency.major())}
          />
        </div>
        <div>
          <p>Extreme – 60 / 55 / 50</p>
          <input
            type="checkbox"
            onChange={(e) => changeChoice(MotionPotency.extreme())}
          />
        </div>
        <br />
        <p>Info: Animate an object(s) to produce motion or resist motion.</p>
        <p>
          Potency Scales with level of mass being moved or total energy
          tolerance for resisting movement
        </p>
      </div>
    </>
  );
};

export default InstillMotion;
