import React, { useState, ChangeEvent } from "react";
import { Mastery } from "../../models/Mastery";

const SoulEnch = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState(0);
  const [checked, check] = useState<boolean>();
  let rate: number = 0;
  let testMastery: Mastery = new Mastery();

  if (!active) setCost(0);

  const handleCheckBox = (event: ChangeEvent<HTMLInputElement>) => {
    const checkedState = event.target.checked;
    check(checkedState);
    if (checkedState) {
      if (ParentMastery.getType() == testMastery.novice()) rate = 20;
      else if (ParentMastery.getType() == testMastery.intermediate()) rate = 15;
      else if (ParentMastery.getType() == testMastery.mastered()) rate = 10;

      setCost(rate || 0);
    }
  };

  return (
    <>
      <div>
        <h1>Soul Enchant</h1>
        <br />
        <input type="checkbox" checked={checked} onChange={handleCheckBox} />
        <br />
        <h4>
          Enable Soul and Spirit damage equal to damage be dealt to target
          immune to physical
        </h4>
        <h4> Only viable with soul-bound weapons</h4>
        <h4> Spell Charge disabled </h4>
      </div>
    </>
  );
};

export default SoulEnch;
