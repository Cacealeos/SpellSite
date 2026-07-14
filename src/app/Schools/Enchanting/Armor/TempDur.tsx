import { useEffect, useState } from "react";
import { Mastery, Spell } from "@/app/models";

const TempDur = ({
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
  let rate = 0;

  switch (ParentMastery.getType()) {
    case "NOVICE":
      rate = 0.05;
      break;
    case "INTERMEDIATE":
      rate = 0.1;
      break;
    case "MASTERED":
      rate = 0.15;
      break;
  }

  /* =========================
   DERIVED VALUE
========================= */
  const durability = Math.min(baseValue * rate * 100, 200);

  /* =========================
   CLAMP WHEN MASTERY CHANGES
========================= */
  useEffect(() => {
    const maxManna = Math.ceil(200 / (rate * 100));

    if (baseValue > maxManna) {
      setBaseValue(maxManna);
    }
  }, [rate, baseValue]);

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
  }, [baseValue, rate, active, updateSpell]);

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-orange-400">
        Manna to Temporary Durability ({rate * 100} / TTT)
      </h1>

      <input
        className="ml-4 w-32 rounded border border-gray-600 bg-gray-800 px-2 py-1 text-center text-gray-100"
        type="number"
        min={0}
        step={1}
        value={baseValue}
        onChange={(e) => setBaseValue(Number(e.target.value))}
      />

      <p className="text-lg">
        <span className="font-medium text-gray-300">Temporary Durability:</span>{" "}
        <span className="font-bold text-blue-400">{durability.toFixed(0)}</span>
      </p>

      <p className="text-sm text-gray-400">
        Info: Converts Manna into temporary Durability at the current mastery
        rate. Maximum Temporary Durability is 200.
      </p>
    </div>
  );
};

export default TempDur;
