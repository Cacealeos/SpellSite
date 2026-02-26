import React, { useState, useEffect } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models/Potency";

const EtherealTempest = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState(0);
  const [pot, setPot] = useState(new Potency());
  const [range, setRange] = useState(false);

  let SpellPotency: Potency = new Potency();
  let testPotency: Potency = new Potency();

  useEffect(() => {
    if (!active) setCost(0);
  }, [active]);

  const changeChoice = (potency: string | void) => {
    if (SpellPotency.getType() === testPotency.minor(true)) setCost(40);
    if (SpellPotency.getType() === testPotency.major(true)) setCost(60);
    if (SpellPotency.getType() === testPotency.extreme(true)) setCost(80);
    setPot(SpellPotency);
  };

  return (
    <>
      <div>
        <h1>Ethereal Tempest</h1>
        <br />
        <h3>Potency</h3>
        <h4>KINETIC DAMAGE</h4>
        <h4>RANGE - RADIAL</h4>
        <h5>Powre 7 || Scaling: 0 / 20%</h5>
        <div>
          <h3>Base: 50</h3>
          <p>Minor 200 / 150 / 100</p>

          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.minor())}
          />
        </div>
        <h3>Base: 100</h3>
        <div>
          <p>Major 320 / 240 / 160</p>
          <br />

          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.major())}
          />
        </div>
        <h3>Base: 150</h3>
        <div>
          <p>Extreme 440 / 330 / 220</p>
          <br />

          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.extreme())}
          />
        </div>
        <br />
        <div>
          <span>Default Range : Moderate AOE</span>
          <br />
          <span>Large AOE: </span>
          <input type="checkbox" onChange={(e) => setRange(!range)} />
        </div>
        <h3>Cost: {cost * (range ? 1.5 : 1)}</h3>
      </div>
    </>
  );
};

export default EtherealTempest;
