import React, { useState, useEffect } from "react";
import { Mastery } from "@/app/models";
import { Potency } from "@/app/models/Potency";

const UnlockSeal = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState(0);

  useEffect(() => {
    if (!active) setCost(0);
  }, [active]);

  return (
    <>
      <div>
        <h1>Unlock Seal</h1>
        <br />
      </div>
    </>
  );
};

export default UnlockSeal;
