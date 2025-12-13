import React, { useState } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models/Potency";

const ReConstitute = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState(0);
  const [pot, setPot] = useState(new Potency());

  let testMastery: Mastery = new Mastery();

  if (!active) setCost(0);

  const changeChoice = (potency: string | void) => {
    if (ParentMastery.getType() === testMastery.novice(true)) {
      setCost(15);
    }
    if (ParentMastery.getType() === testMastery.intermediate(true)) {
      setCost(10);
    }
    if (ParentMastery.getType() === testMastery.mastered(true)) {
      setCost(5);
    }
  };

  return (
    <>
      <div>
        <h1>Re-Constitute</h1>
        <br />

        <div>
          <p>15/10/0</p>
        </div>

        <br />
        <p>Info: Reconstruct missing limbs</p>
        <p>
          Number of limbs must be selected dynamically. *See: Battle Mechanics
          Doc*
        </p>
      </div>
    </>
  );
};

export default ReConstitute;
