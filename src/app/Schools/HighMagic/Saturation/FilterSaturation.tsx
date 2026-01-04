import React, { useState } from "react";
import { Mastery } from "../../../models/Mastery";

const FilterSaturation = ({
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

  if (ParentMastery.getType() === testMastery.novice(true)) rate = 5;
  else if (ParentMastery.getType() === testMastery.intermediate(true)) rate = 4;
  else if (ParentMastery.getType() === testMastery.mastered(true)) rate = 3;

  return (
    <>
      <div>
        <h1>Filter Saturation</h1>
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
      <br />
      <p>KINETIC</p>
      <br />
      <p>RANGE - RADIAL</p>
      <p>
        Info: Decrease Saturation by a TTT Manna to filtration rate. Filter
        Saturation is dynamically cast and quantity of TTT is decided by caster
        on a TTT basis.
      </p>
      <p>Max Dilution rate increases with Mastery: 50 / 100 / 150</p>
      <p>
        Filter Saturation has Saturation Threshold and can be used at complete
        Area Saturation
      </p>
      <p>
        Higher range results in larger cost penalty in the form of TTT
        multiplier
      </p>
      <p>
        TTT Range  Enclosed Area: Cost x .5  Open Area: Cost x 1  Large Area:
        Cost x 3  Massive Area: Cost x 9
      </p>
    </>
  );
};

export default FilterSaturation;
