import React, { useState, useEffect } from "react";
import { Mastery } from "@/app/models";
import { Potency } from "@/app/models/Potency";

const ReceptorLimiter = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState(0);
  const [target, setTarget] = useState("");

  useEffect(() => {
    if (!active) setCost(0);
  }, [active]);

  return (
    <>
      <div>
        <h1>Receptor Limiter</h1>
        <br />
        <span>Enter an desired recptor to disable with seal.</span>
        <textarea onChange={(e) => setTarget(e.target.value)}></textarea>
      </div>
    </>
  );
};

export default ReceptorLimiter;
