import React, { useState } from "react";
import { Mastery } from "../../models/Mastery";

const Accuracy = ({
  Mastery,
  active,
}: {
  Mastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState(0);
  let rate: number = 0;

  if (!active) setCost(0);

  if (Mastery.type == "NOVICE") rate = 0.2;
  else if (Mastery.type == "INTERMEDIATE") rate = 0.1;
  else if (Mastery.type == "MASTERED") rate = 0.05;

  return (
    <>
      <div>
        <h1>Manna to Accuracy</h1>
        <br />
        <input
          type="number"
          max="200"
          min="0"
          step="1"
          value="0"
          onChange={(e) => setCost(Number(e.target.value) * rate || 0)}
        />
        <br />
      </div>
    </>
  );
};

export default Accuracy;
