import { useEffect, useState } from "react";

import { Mastery, Spell } from "@/app/models";

const SoulEnch = ({
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
        ttt = 20;
        break;

      case "INTERMEDIATE":
        ttt = 15;
        break;

      case "MASTERED":
        ttt = 10;
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
    updateSpell("cost", 0);

    if (!active) {
      setEnabled(false);
      updateSpell("ttt", 0);
      return;
    }

    updateSpell("ttt", ttt);
  }, [active, enabled, ParentMastery, updateSpell]);

  return (
    <>
      <div>
        <h2 className="text-xl font-bold text-orange-400">Soul Enchant</h2>

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
          <span className="font-medium">20 / 15 / 10</span>
        </p>

        <div className="mt-4 space-y-2 text-sm text-gray-400">
          <p>
            Enables Soul and Spirit damage equal to the damage dealt to targets
            that are immune to physical damage.
          </p>

          <p>Only viable with soul-bound weapons.</p>

          <p>Spell Charge is disabled.</p>
        </div>
      </div>
    </>
  );
};

export default SoulEnch;
