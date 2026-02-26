import React, { useState, useEffect } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models/Potency";

const LifeBringer = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState(0);
  const [pot, setPot] = useState(new Potency());

  const [spell, setSpell] = useState({
    DTL: 0,
    DTLbase: 0,
    LTD: 0,
    LTDbase: 0,
  });

  let SpellPotency: Potency = new Potency();
  let testPotency: Potency = new Potency();

  useEffect(() => {
    if (!active) setCost(0);
  }, [active]);

  const changeChoice = (potency: string | void, type: number) => {
    if (SpellPotency.getType() === testPotency.minor(true)) {
      setSpell((prev) => ({
        ...prev,
        ...(type === 1 ? { DTL: 15, DTLbase: 40 } : { LTD: 0.2, LTDbase: 20 }),
      }));
    }
    if (SpellPotency.getType() === testPotency.major(true)) {
      setSpell((prev) => ({
        ...prev,
        ...(type === 1 ? { DTL: 10, DTLbase: 80 } : { LTD: 0.1, LTDbase: 40 }),
      }));
    }

    if (SpellPotency.getType() === testPotency.extreme(true)) {
      setSpell((prev) => ({
        ...prev,
        ...(type === 1 ? { DTL: 5, DTLbase: 120 } : { LTD: 0.05, LTDbase: 60 }),
      }));
    }
    setPot(SpellPotency);
  };

  return (
    <>
      <div>
        <h1>Life Bringer</h1>
        <br />
        <h2>Durability to Life-Force</h2>
        <p>Potency</p>

        <div>
          <p>Minor 40 | 15/1</p>

          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.minor(), 1)}
          />
        </div>
        <div>
          <p>Major 80 | 10/1</p>
          <br />

          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.major(), 1)}
          />
        </div>
        <div>
          <p>Extreme 120 | 5/1</p>
          <br />

          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.extreme(), 1)}
          />
        </div>
        <br />
        <div>
          <p>Minor 20 | 1/5</p>

          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.minor(), 0)}
          />
        </div>
        <div>
          <p>Major 40 | 1/10</p>
          <br />

          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.major(), 0)}
          />
        </div>
        <div>
          <p>Extreme 60 | 1/20</p>
          <br />

          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.extreme(), 0)}
          />
        </div>
      </div>
    </>
  );
};

export default LifeBringer;
