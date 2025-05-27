import React, { useState } from "react";
import { Mastery } from "../../models/Mastery";

const Weapon_Damage = ({
  Mastery,
  active,
}: {
  Mastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState(0);
  let rate: number = 0;

  if (!active) setCost(0);

  if (Mastery.type == "NOVICE") rate = 3;
  else if (Mastery.type == "INTERMEDIATE") rate = 2;
  else if (Mastery.type == "MASTERED") rate = 1;

  //test push

  return (
    <>
      <div>
        <h1>Manna to Damage</h1>
        <br />
        <input
          type="number"
          max="255"
          min="0"
          step="1"
          value="0"
          onChange={(e) => setCost(Number(e.target.value) * rate || 0)}
        />
        <br />
        <h4>Maximum damage cannot go no higher than BASE x2 of melee weapon</h4>
      </div>
    </>
  );
};

export default Weapon_Damage;
