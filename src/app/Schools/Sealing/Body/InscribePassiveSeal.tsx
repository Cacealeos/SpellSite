import React, { useState, useEffect } from "react";
import { Mastery } from "@/app/models";
import { Potency } from "@/app/models/Potency";

const InscribePassive = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [techCheck, setTechCheck] = useState(0);
  const [TTT, setTTT] = useState(0);

  useEffect(() => {
    if (!active) setTTT(0);
  }, [active]);

  return (
    <>
      <div>
        <h1>Inscribe Passive Seal</h1>
        <br />
        <span>Potency</span>
        <div>
          <p>Minor</p>
          <input type="checkbox" onChange={(e) => setTechCheck(35)} />
        </div>
        <div>
          <p>Major</p>
          <input type="checkbox" onChange={(e) => setTechCheck(70)} />
        </div>
        <div>
          <p>Extreme</p>
          <input type="checkbox" onChange={(e) => setTechCheck(105)} />
        </div>
        <br />
      </div>
      <div>
        <span>Passive Effects</span>
        <br />
        <span>TTT</span>
        <input
          type="number"
          min="0"
          value={TTT}
          onChange={(e) => setTTT(Number(e.target.value))}
        />
        <textarea></textarea>
      </div>
    </>
  );
};

export default InscribePassive;
