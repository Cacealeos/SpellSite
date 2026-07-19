import { useEffect, useState } from "react";
import { Mastery, Spell } from "@/app/models";

const Accuracy = ({
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
      rate = 10;
      break;
    case "INTERMEDIATE":
      rate = 15;
      break;
    case "MASTERED":
      rate = 20;
      break;
  }

  /* =========================
     DERIVED VALUE
  ========================= */
  const accuracy = Math.min(baseValue * rate, 200);

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
     CLAMP WHEN MASTERY CHANGES
  ========================= */
  useEffect(() => {
    const maxTTT = Math.ceil(200 / rate);

    if (baseValue > maxTTT) {
      setBaseValue(maxTTT);
    }
  }, [rate, baseValue]);

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
        Manna to Accuracy ({rate} Accuracy / TTT)
      </h1>

      <input
        className="ml-4 w-32 rounded border border-gray-600 bg-gray-800 px-2 py-1 text-center text-gray-100"
        type="number"
        min={0}
        max={Math.ceil(200 / rate)}
        step={1}
        value={baseValue}
        onChange={(e) => setBaseValue(Number(e.target.value))}
      />

      <p className="text-lg">
        <span className="text-lg font-semibold text-orange-400">
          Accuracy Bonus:
        </span>{" "}
        <span className="font-bold text-blue-400">{accuracy}</span>
      </p>

      <p className="text-sm text-gray-400">
        Info: Converts Manna into temporary Accuracy at the current mastery
        rate. Maximum Accuracy is 200.
      </p>
    </div>
  );
};

export default Accuracy;
