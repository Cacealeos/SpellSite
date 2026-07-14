import { useEffect, useState } from "react";
import { Mastery, Spell } from "@/app/models";

const PainThresh = ({
  ParentMastery,
  active,
  updateSpell,
}: {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
}) => {
  const [baseValue, setBaseValue] = useState(0);
  const [baseThreshold, setBaseThreshold] = useState(0);

  /* =========================
     MASTERY MULTIPLIER
  ========================= */
  let rate = 0;

  switch (ParentMastery.getType()) {
    case "NOVICE":
      rate = 5;
      break;
    case "INTERMEDIATE":
      rate = 7;
      break;
    case "MASTERED":
      rate = 10;
      break;
  }

  /* =========================
     DERIVED VALUE
  ========================= */
  const painThreshold = baseValue * rate;

  const temporaryThreshold =
    baseThreshold > 0
      ? Math.min(painThreshold, baseThreshold * 0.5)
      : painThreshold;

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
     ADJUST TTT WHEN BASE THRESHOLD CHANGES
  ========================= */
  useEffect(() => {
    if (baseThreshold <= 0 || rate <= 0) return;

    const maxThreshold = baseThreshold * 0.5;
    const maxTTT = Math.floor(maxThreshold / rate);

    if (baseValue > maxTTT) {
      setBaseValue(Math.max(1, maxTTT));
    }
  }, [baseThreshold, rate, baseValue]);

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
        Manna to Pain Threshold ({rate} Pain / TTT)
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
        <span className="text-lg font-semibold text-orange-400">
          Temporary Pain Threshold:
        </span>{" "}
        <span className="font-bold text-blue-400">{temporaryThreshold}</span>
      </p>

      <div className="mt-6">
        <h2 className="mb-2 text-sm font-semibold text-gray-400">
          Base Threshold (Optional)
        </h2>

        <input
          className="ml-4 w-32 rounded border border-gray-600 bg-gray-800 px-2 py-1 text-center text-gray-100 placeholder:italic placeholder:text-gray-500"
          type="text"
          inputMode="numeric"
          placeholder="None"
          value={baseThreshold === 0 ? "" : baseThreshold}
          onChange={(e) => {
            const value = Number(e.target.value);
            setBaseThreshold(Number.isNaN(value) ? 0 : value);
          }}
        />
      </div>

      <p className="text-sm text-gray-400">
        Info: Converts Manna into temporary Pain Threshold. Maximum temporary
        threshold is equal to 50% of base threshold.
      </p>
    </div>
  );
};

export default PainThresh;
