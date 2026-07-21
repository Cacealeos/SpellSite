import { useEffect, useState } from "react";

import { Mastery, Spell } from "@/app/models";

const WeaponDamage = ({
  ParentMastery,
  active,
  updateSpell,
}: {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
}) => {
  const [baseDamage, setBaseDamage] = useState(0);
  const [enchantmentDamage, setEnchantmentDamage] = useState(0);

  /* =========================
   MASTERY MULTIPLIER
========================= */

  let rate = 0;

  switch (ParentMastery.getType()) {
    case "NOVICE":
      rate = 3;
      break;

    case "INTERMEDIATE":
      rate = 2;
      break;

    case "MASTERED":
      rate = 1;
      break;
  }

  /* =========================
   CLAMP ENCHANTMENT DAMAGE
========================= */

  useEffect(() => {
    if (baseDamage > 0) {
      setEnchantmentDamage((prev) => Math.min(prev, baseDamage));
    }
  }, [baseDamage]);

  /* =========================
   DERIVED VALUE
========================= */

  const ttt = enchantmentDamage * rate;

  /* =========================
   RESET WHEN INACTIVE
========================= */

  useEffect(() => {
    if (!active) {
      setBaseDamage(0);
      setEnchantmentDamage(0);

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
  }, [active, enchantmentDamage, ttt, updateSpell]);

  return (
    <>
      <div>
        <h2 className="text-xl font-bold text-orange-400">Manna to Damage</h2>

        <div className="mt-1 mb-4 h-px bg-gray-600" />

        <h3 className="text-lg font-semibold text-orange-400">Weapon Damage</h3>

        <input
          className="ml-4 w-32 rounded border border-gray-600 bg-gray-800 px-2 py-1 text-center text-gray-100"
          type="number"
          min={0}
          max={baseDamage > 0 ? baseDamage : undefined}
          step={1}
          value={enchantmentDamage}
          onChange={(e) =>
            setEnchantmentDamage(
              Math.min(
                Number(e.target.value) || 0,
                baseDamage > 0 ? baseDamage : Number.MAX_SAFE_INTEGER,
              ),
            )
          }
        />

        <h3 className="mt-4 text-lg font-semibold text-orange-400">
          Base Weapon Damage (Optional)
        </h3>

        <input
          className="ml-4 w-32 rounded border border-gray-600 bg-gray-800 px-2 py-1 text-center text-gray-100"
          type="number"
          min={0}
          step={1}
          value={baseDamage}
          onChange={(e) => setBaseDamage(Number(e.target.value) || 0)}
        />

        <p className="mt-3 text-lg">
          <span className="font-medium text-gray-300">TTT:</span>{" "}
          <span className="font-bold text-blue-400">{ttt}</span>
        </p>

        <p className="text-sm text-gray-400">
          TTT: 3 / 2 / 1 per damage based on mastery.
        </p>

        <p className="mt-2 text-sm text-gray-400">
          Maximum damage cannot exceed BASE × 2 of the melee weapon.
        </p>
      </div>
    </>
  );
};

export default WeaponDamage;
