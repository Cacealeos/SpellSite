import { useEffect, useState } from "react";
import { Mastery, Spell } from "@/app/models";

const Disruption = ({
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
      rate = 2;
      break;
    case "INTERMEDIATE":
      rate = 3;
      break;
    case "MASTERED":
      rate = 4;
      break;
  }

  /* =========================
   CLAMP WHEN MASTERY CHANGES
========================= */
  useEffect(() => {
    const maxTTT = Math.ceil(50 / rate);

    setBaseValue((prev) => Math.min(prev, maxTTT));
  }, [rate]);

  /* =========================
     DERIVED VALUE
  ========================= */
  const disruption = Math.min(baseValue * rate, 50);

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
        Manna to Disruption ({rate} Disruption / TTT)
      </h1>

      <input
        className="ml-4 w-32 rounded border border-gray-600 bg-gray-800 px-2 py-1 text-center text-gray-100"
        type="number"
        min={0}
        max={Math.ceil(50 / rate)}
        step={1}
        value={baseValue}
        onChange={(e) => {
          const value = Number(e.target.value);
          const maxTTT = Math.ceil(50 / rate);

          setBaseValue(Math.min(value, maxTTT));
        }}
      />

      <p className="text-lg">
        <span className="font-medium text-gray-300">Disruption:</span>{" "}
        <span className="font-bold text-blue-400">{disruption}</span>
      </p>

      <p className="text-sm text-gray-400">
        Info: Converts Manna into temporary Disruption at the current mastery
        rate. Maximum Disruption is 50.
      </p>
    </div>
  );
};

export default Disruption;
