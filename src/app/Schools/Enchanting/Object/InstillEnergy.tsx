import { useEffect, useState } from "react";
import { Mastery, Spell } from "@/app/models";

const InstillEnergy = ({
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
      rate = 5;
      break;
    case "INTERMEDIATE":
      rate = 3;
      break;
    case "MASTERED":
      rate = 2;
      break;
  }

  /* =========================
     DERIVED VALUE
  ========================= */
  const energy = baseValue * rate;

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
        Instill Energy ({rate} / TTT)
      </h1>

      <input
        className="ml-4 w-32 rounded border border-gray-600 bg-gray-800 px-2 py-1 text-center text-gray-100"
        type="number"
        min={0}
        max={50}
        step={1}
        value={baseValue}
        onChange={(e) => setBaseValue(Number(e.target.value))}
      />

      <p className="text-lg">
        <span className="font-medium text-gray-300">Energy Transferred:</span>{" "}
        <span className="font-bold text-blue-400">{energy}</span>
      </p>

      <p className="text-sm text-gray-400">
        Info: Transfers or extracts energy from an object. Energy transfer rate
        scales with Mastery.
      </p>
    </div>
  );
};

export default InstillEnergy;
