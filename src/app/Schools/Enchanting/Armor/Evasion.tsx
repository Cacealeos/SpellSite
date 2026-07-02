import React, { useMemo, useState, useEffect } from "react";
import { Mastery, Spell } from "@/app/models";

const Evasion = ({
  ParentMastery,
  active,
  updateSpell,
}: {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
}) => {
  const [baseValue, setBaseValue] = useState(0);

  /* =========================
     MASTERY MULTIPLIER
  ========================= */
  const rate = useMemo(() => {
    const type = ParentMastery.getType();

    if (type === "NOVICE") return 0.1;
    if (type === "INTERMEDIATE") return 0.15;
    if (type === "MASTERED") return 0.2;

    return 0;
  }, [ParentMastery]);

  /* =========================
     RESET WHEN INACTIVE
  ========================= */
  useEffect(() => {
    if (!active) {
      setBaseValue(0);
      updateSpell("ttt", 0);
      updateSpell("cost", 0);
    }
  }, [active, updateSpell]);

  /* =========================
     DERIVED VALUE
  ========================= */
  const cost = baseValue * rate;

  /* =========================
     SYNC TO PARENT SPELL
  ========================= */
  useEffect(() => {
    if (!active) return;

    updateSpell("cost", cost);
    updateSpell("ttt", baseValue);
  }, [cost, baseValue, active, updateSpell]);

  return (
    <div>
      <h1>Manna to Evasion</h1>

      <input
        type="number"
        max={200}
        min={0}
        step={1}
        value={baseValue}
        onChange={(e) => setBaseValue(Number(e.target.value))}
      />

      <div>Cost: {cost.toFixed(2)}</div>
    </div>
  );
};

export default Evasion;
