import { useEffect, useState } from "react";

import { Mastery, Spell } from "@/app/models";

const SpiritEnch = ({
  ParentMastery,
  active,
  updateSpell,
}: {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
}) => {
  const [enabled, setEnabled] = useState(false);

  let ttt = 0;

  if (enabled) {
    switch (ParentMastery.getType()) {
      case "NOVICE":
        ttt = 10;
        break;

      case "INTERMEDIATE":
        ttt = 5;
        break;

      case "MASTERED":
        ttt = 1;
        break;
    }
  }

  /* =========================
     RESET WHEN INACTIVE
  ========================= */

  useEffect(() => {
    if (!active) {
      setEnabled(false);
      updateSpell("cost", 0);
      updateSpell("ttt", 0);
    }
  }, [active, updateSpell]);

  /* =========================
     SYNC TO PARENT SPELL
  ========================= */

  useEffect(() => {
    if (!active) {
      updateSpell("cost", 0);
      updateSpell("ttt", 0);
      return;
    }

    updateSpell("cost", 0);
    updateSpell("ttt", ttt);
  }, [active, enabled, ParentMastery, updateSpell]);

  return (
    <>
      <div>
        <h2 className="text-xl font-bold text-orange-400">Spirit Enchant</h2>

        <div className="mt-1 mb-4 h-px bg-gray-600" />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
          />
          Enable
        </label>

        <p className="mt-2 text-sm text-gray-400">
          TTT (Novice / Intermediate / Mastered):{" "}
          <span className="font-medium">10 / 5 / 1</span>
        </p>

        <div className="mt-4 space-y-2 text-sm text-gray-400">
          <p>
            Enables Spirit damage equal to the damage dealt to targets immune to
            physical damage.
          </p>

          <p>Spell Charge is disabled.</p>
        </div>
      </div>
    </>
  );
};

export default SpiritEnch;
