import React, { useState } from "react";
import { Mastery } from "../../models/Mastery";
import { Potency } from "@/app/models/Potency";

const Coherence = ({
  Mastery,
  active,
}: {
  Mastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState(0);
  const [pot, setPot] = useState(new Potency());

  let CoherencePotency: Potency = new Potency();

  if (!active) setCost(0);

  const changeChoice = (potency: void) => {
    if (Mastery.getType() == "NOVICE") {
      if (CoherencePotency.getType() == "MINOR") setCost(30);
      if (CoherencePotency.getType() == "MAJOR") setCost(45);
      if (CoherencePotency.getType() == "EXTREME") setCost(60);
      setPot(CoherencePotency);
    }
    if (Mastery.getType() == "INTERMEDIATE") {
      if (CoherencePotency.getType() == "MINOR") setCost(25);
      if (CoherencePotency.getType() == "MAJOR") setCost(40);
      if (CoherencePotency.getType() == "EXTREME") setCost(55);
      setPot(CoherencePotency);
    }
    if (Mastery.getType() == "MASTERED") {
      if (CoherencePotency.getType() == "MINOR") setCost(20);
      if (CoherencePotency.getType() == "MAJOR") setCost(35);
      if (CoherencePotency.getType() == "EXTREME") setCost(50);
      setPot(CoherencePotency);
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
            onChange={(e) => changeChoice(CoherencePotency.minor())}
          />
        </div>
        <div>
          <p>Major – 45 / 40 / 35</p>
          <input
            type="checkbox"
            onChange={(e) => changeChoice(CoherencePotency.major())}
          />
        </div>
        <div>
          <p>Extreme – 60 / 55 / 50</p>
          <input
            type="checkbox"
            onChange={(e) => changeChoice(CoherencePotency.extreme())}
          />
        </div>
        <br />
        <p>
          Info: Allows the wearer of armor to audibly or mentally communicate
          with wearers of other pieces of equipment that have the same
          enchantment.
        </p>
        <p>
          The number of targets that can communicate on the same channel scales
          with potency and environment. |GMD|
        </p>
      </div>
    </>
  );
};

export default Coherence;

// •	Adherence
// o	Info: Allows caster to place manna-channeled objects to armor so that they may be carried without using up an orifice. The number of targets that can be attached on the same piece of armor scales with potency and environment. (GMD)
// o	Minor – 30 / 25 / 20	Major – 45 / 40 / 35	Extreme – 60 / 55 / 50
// •	Manna to Evasion:	 (1/10) / (1/15) / (1/20)
// o	Max Evade is 200
// •	Manna to Temporary Durability: 	(1/5) / (1/10) / (1/15)
// o	Max Durability is 200
// •	Manna to Disruption Threshold:	(1/5) / (1/7) / (1/10)
// o	Max temporary threshold equal to 50% of base threshold
// •	Manna to Pain Threshold:	 (1/5) / (1/7) / (1/10)
// o	Max temporary threshold equal to 50% of base threshold
// •	Absorb Energy
// o	Target recovers portion of manna used in attack against target.
// o	Minor (10%) – 9 / 6 / 3 	Major (20%) – 15 / 12 / 9 	Extreme (30%) – 21 / 18 / 15
