import React, { useState, useEffect } from "react";
import { Mastery } from "../../../models/Mastery";
import Select from "@/app/Select";

const TransmuteDimensional = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [res, setRes] = useState(0);
  const [damage, setDamage] = useState(0);
  const [read, setRead] = useState(false);

  let testMastery: Mastery = new Mastery();
  let rates: number[] = [0, 0, 0];
  let forms: string[] = ["Tear", "Crush", "Dissolve"];
  let aoe: number = 0;

  useEffect(() => {
    if (!active) {
      setRes(0);
      setDamage(0);
    }
  }, [active]);

  if (ParentMastery.getType() === testMastery.novice(true))
    rates = [350, 4, 100];
  else if (ParentMastery.getType() === testMastery.intermediate(true))
    rates = [280, 3, 75];
  else if (ParentMastery.getType() === testMastery.mastered(true))
    rates = [210, 2, 50];

  function changeChoice(choice: string) {
    aoe = forms.indexOf(choice);
  }

  return (
    <>
      <div>
        <h1>Transmute Dimensional</h1>
        <Select
          title="Form"
          choices={forms}
          changeChoice={() => changeChoice}
        ></Select>
        <h2>Bonus Damage</h2>
        <input
          type="number"
          min="0"
          step={rates[1]}
          value={damage}
          onChange={(e) => setDamage(Number(e.target.value) * rates[1] || 0)}
        />
        <br />
        <h2>Res</h2>
        <input
          type="number"
          min="0"
          max="20"
          step="1"
          value={res}
          onChange={(e) => setRes(Number(e.target.value) * rates[2] || 0)}
          readOnly={read}
        />
        <br />
      </div>
      <h3>DIMENSIONAL DAMAGE</h3>
      <h3>RANGE - RADIAL</h3>
      <h3>AOE - {aoe > 0 ? "Moderate" : "Small"}</h3>

      <h2>Secondary</h2>
      <div>
        <h3>DIMENSIONAL</h3>
        <h3>RANGE - DIRECT</h3>
        <h3>AOE - None</h3>
        <h3>Check: {res} vs Res</h3>
      </div>
    </>
  );
};

export default TransmuteDimensional;
