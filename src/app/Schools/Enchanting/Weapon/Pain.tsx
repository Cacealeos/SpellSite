import React, { useState, useEffect } from "react";
import { Mastery, Spell } from "@/app/models";

const Pain = ({
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
  const mastery = ParentMastery.getType();

  let pain = 0;
  let maxTTT = 0;
  let title = "";

  switch (mastery) {
    case "NOVICE":
      pain = Math.min(Math.floor(baseValue / 2), 50);
      maxTTT = 100;
      title = "2 TTT / Pain";
      break;

    case "INTERMEDIATE":
      pain = Math.min(baseValue, 50);
      maxTTT = 50;
      title = "1 TTT / Pain";
      break;

    case "MASTERED":
      pain = Math.min(baseValue * 2, 50);
      maxTTT = 25;
      title = ".5 TTT / Pain";
      break;
  }

  /* =========================
   CLAMP WHEN MASTERY CHANGES
========================= */
  useEffect(() => {
    setBaseValue((prev) => Math.min(prev, maxTTT));
  }, [maxTTT]);

  /* =========================
       RESET WHEN INACTIVE
    ========================= */
  useEffect(() => {
    if (!active) {
      setBaseValue(0);
      updateSpell("ttt", 0);
    }
  }, [active, updateSpell]);

  /* =========================
       SYNC TO PARENT SPELL
    ========================= */
  useEffect(() => {
    if (!active) return;

    updateSpell("ttt", baseValue);
  }, [baseValue, active, updateSpell]);

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-orange-400">
        Manna to Pain ({title})
      </h1>

      <input
        className="ml-4 w-32 rounded border border-gray-600 bg-gray-800 px-2 py-1 text-center text-gray-100"
        type="number"
        min={0}
        step={1}
        value={baseValue}
        max={maxTTT}
        onChange={(e) => setBaseValue(Math.min(Number(e.target.value), maxTTT))}
      />

      <p className="text-lg">
        <span className="font-medium text-gray-300">Pain:</span>{" "}
        <span className="font-bold text-blue-400">{pain}</span>
      </p>

      <p className="text-sm text-gray-400">
        Info: Converts Manna into temporary Pain at the current mastery rate.
        Maximum Pain is 50.
      </p>
    </div>
  );
};

export default Pain;
