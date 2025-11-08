import React, { useState } from "react";
import { Mastery } from "../../../models/Mastery";

const Pain = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState(0);
  let rate: number = 0;
  let testMastery: Mastery = new Mastery();

  if (!active) setCost(0);

  if (ParentMastery.getType() == testMastery.novice()) rate = 2;
  else if (ParentMastery.getType() == testMastery.intermediate()) rate = 1;
  else if (ParentMastery.getType() == testMastery.mastered()) rate = 0.5;
  return (
    <>
      <div>
        <h1>Manna to Pain</h1>
        <br />
        <input
          type="number"
          max="50"
          min="0"
          step="1"
          value="0"
          onChange={(e) => setCost(Number(e.target.value) * rate || 0)}
        />
        <br />
        <h4>Deal Pain with every hit of weapon to a maximum of 50</h4>
      </div>
    </>
  );
};

export default Pain;
