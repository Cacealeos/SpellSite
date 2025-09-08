import React, { useState, ChangeEvent } from "react";
import { Mastery } from "../../models/Mastery";

const SpiritEnch = ({
  Mastery,
  active,
}: {
  Mastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState(0);
  const [checked, check] = useState<boolean>();
  let rate: number = 0;

  if (!active) setCost(0);

  const handleCheckBox = (event: ChangeEvent<HTMLInputElement>) => {
    const checkedState = event.target.checked;
    check(checkedState);
    if (checkedState) {
      if (Mastery.type == "NOVICE") rate = 10;
      else if (Mastery.type == "INTERMEDIATE") rate = 5;
      else if (Mastery.type == "MASTERED") rate = 1;

      setCost(rate || 0);
    }
  };

  return (
    <>
      <div>
        <h1>Spirit Enchant</h1>
        <br />
        <input type="checkbox" checked={checked} onChange={handleCheckBox} />
        <br />
        <h4>
          Enable Spirit damage equal to damage be dealt to target immune to
          physical
        </h4>
        <h4> Spell Charge disabled </h4>
      </div>
    </>
  );
};

export default SpiritEnch;
