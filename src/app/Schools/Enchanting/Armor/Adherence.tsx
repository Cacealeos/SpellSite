import React, { useState } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models/Potency";

const Adherence = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState(0);
  const [pot, setPot] = useState(new Potency());

  let AdherencePotency: Potency = new Potency();
  let testPotency: Potency = new Potency();
  let testMastery: Mastery = new Mastery();

  if (!active) setCost(0);

  const changeChoice = (potency: string | void) => {
    if (ParentMastery.getType() === testMastery.novice(true)) {
      if (AdherencePotency.getType() === testPotency.minor(true)) setCost(30);
      if (AdherencePotency.getType() === testPotency.major(true)) setCost(45);
      if (AdherencePotency.getType() === testPotency.extreme(true)) setCost(60);
      setPot(AdherencePotency);
    }
    if (ParentMastery.getType() === testMastery.intermediate(true)) {
      if (AdherencePotency.getType() === testPotency.minor(true)) setCost(25);
      if (AdherencePotency.getType() === testPotency.major(true)) setCost(40);
      if (AdherencePotency.getType() === testPotency.extreme(true)) setCost(55);
      setPot(AdherencePotency);
    }
    if (ParentMastery.getType() === testMastery.mastered(true)) {
      if (AdherencePotency.getType() === testPotency.minor(true)) setCost(20);
      if (AdherencePotency.getType() === testPotency.major(true)) setCost(35);
      if (AdherencePotency.getType() === testPotency.extreme(true)) setCost(50);
      setPot(AdherencePotency);
    }
  };

  return (
    <>
      <div>
        <h1>Coherence</h1>
        <br />
        <p>Potency</p>
        <div>
          <p>Minor – 30 / 25 / 20</p>
          <input
            type="checkbox"
            onChange={(e) => changeChoice(AdherencePotency.minor())}
          />
        </div>
        <div>
          <p>Major – 45 / 40 / 35</p>
          <input
            type="checkbox"
            onChange={(e) => changeChoice(AdherencePotency.major())}
          />
        </div>
        <div>
          <p>Extreme – 60 / 55 / 50</p>
          <input
            type="checkbox"
            onChange={(e) => changeChoice(AdherencePotency.extreme())}
          />
        </div>
        <br />
        <p>
          Info: Allows caster to place manna-channeled objects to armor so that
          they may be carried without using up an orifice.
        </p>
        <p>
          The number of targets that can be attached on the same piece of armor
          scales with potency and environment. |GMD|
        </p>
      </div>
    </>
  );
};

export default Adherence;
