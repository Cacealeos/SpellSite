import React, { useState, useEffect } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models/Potency";
import Select from "@/app/Select";

const TransmuteLightHeat = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [power, setPower] = useState(0);
  const [damage, setDamage] = useState(0);
  const [type, setType] = useState("");

  let testMastery: Mastery = new Mastery();
  let choices: string[] = ["Light", "Heat", "Cold"];
  let rates: number[] = [0, 0];

  useEffect(() => {
    if (!active) {
      setPower(0);
      setDamage(0);
    }
  }, [active]);

  if (ParentMastery.getType() === testMastery.novice(true)) rates = [35, 6];
  else if (ParentMastery.getType() === testMastery.intermediate(true))
    rates = [30, 5];
  else if (ParentMastery.getType() === testMastery.mastered(true))
    rates = [25, 4];

  return (
    <>
      <div>
        <h1>Transmute Light & Heat & Cold</h1>
        <h2>Power</h2>

        <br />
        <Select
          choices={choices}
          title="Type"
          changeChoice={() => setType}
        ></Select>
        <input
          type="number"
          min="0"
          max={8 - choices.indexOf(type)}
          step="1"
          value={power}
          onChange={(e) => setPower(Number(e.target.value) * rates[0] || 0)}
        />
        <h2>Damage</h2>
        <input
          type="number"
          min="0"
          step="1"
          value={damage}
          onChange={(e) => setDamage(Number(e.target.value) * rates[0] || 0)}
        />
        <br />
      </div>
      <h3>{choices.indexOf(type) !== 0 ? "THERMAL" : "ELECTRIC"}</h3>
      <h3>RANGE - RADIAL</h3>
      <h3>AOE: {power > 4 ? (power > 6 ? "Large" : "Moderate") : "Small"}</h3>

      <h2>Secondary</h2>
      <div>
        <h3>{choices.indexOf(type) !== 0 ? "THERMAL" : "ELECTRIC"}</h3>
        <h3>RANGE - RADIAL</h3>
        <h3>AOE - Small</h3>
        <h3>Check: {power * 2} vs Res OR Dis</h3>
      </div>
    </>
  );
};

export default TransmuteLightHeat;
