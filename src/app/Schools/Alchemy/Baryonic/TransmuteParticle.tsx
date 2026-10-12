import { useEffect, useState } from "react";
import { Mastery, Spell } from "@/app/models";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";
// ==================================================
// Types
// ==================================================

type TransmutePartProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

// ==================================================
// Mastery Rates
// ==================================================

const getRates = (masteryType: string): number[] => {
  switch (masteryType) {
    case "NOVICE":
      return [25, 6, 150];

    case "INTERMEDIATE":
      return [20, 5, 120];

    case "MASTERED":
      return [15, 4, 90];

    default:
      return [0, 0, 0];
  }
};

const TransmutePart = ({
  ParentMastery,
  active,
  updateSpell,
}: TransmutePartProps) => {
  // ==================================================
  // State
  // ==================================================

  const [power, setPower] = useState(5);
  const [damage, setDamage] = useState(0);

  const [spellSurge, setSpellSurge] = useState(false);
  // ==================================================
  // Spell Techniques
  // ==================================================

  const Techniques = {
    "Quick Spell": true,
    "Spell Reflex": false,
    "Double Cast": true,
    "Double Pulse": true,
    "Carry Spell": true,
    "Spell Shift": true,
    "Counter Spell": true,
    "Spell Surge": true,
    "Junction Cast": true,
    "Spell Charge": true,
    "Focus Spell": true,
    "Hyper Spell": true,
    "Auto Cast": false,
    "Rivet Cast": true,
    "Spell Recovery": false,
    "Father Spell": false,
  };

  // ==================================================
  // Mastery / Rates
  // ==================================================

  const masteryType = ParentMastery.getType();

  const rates = getRates(masteryType);

  const powerRate = rates[0];
  const damageRate = rates[1];
  const baseCost = rates[2];

  // ==================================================
  // Spell Statistics
  // ==================================================

  const powerCost = powerRate * (power - 5);

  const damageCost = damageRate * damage;

  const finalCost = Math.round(baseCost + powerCost + damageCost);

  const finalDamage = damage + 150;

  // ==================================================
  // Reset Local State
  // ==================================================

  useEffect(() => {
    if (active) return;

    setPower(5);
    setDamage(0);
    setSpellSurge(false);
  }, [active]);

  // ==================================================
  // Update Parent Spell
  // ==================================================

  useEffect(() => {
    if (!active) return;

    updateSpell("cost", finalCost);

    // This spell does not intrinsically generate TTT.
    updateSpell("ttt", 0);
  }, [active, finalCost, updateSpell]);

  // ==================================================
  // Render
  // ==================================================

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-gray-200 shadow-lg">
      <SpellTechniquesTable techniques={Techniques} />

      {/* ================================================== */}
      {/* Spell Title */}
      {/* ================================================== */}

      <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h1 className="text-2xl font-bold text-cyan-400">Transmute Particle</h1>

        <div className="mt-4 space-y-1">
          <p className="text-sm font-semibold text-gray-400">
            EXPLOSIVE DAMAGE
          </p>

          <p className="text-sm font-semibold text-gray-400">RANGE - RADIAL</p>

          <p className="text-sm font-semibold text-gray-400">
            Scaling: 0 / 33%
          </p>
        </div>
      </div>

      {/* ================================================== */}
      {/* Manna to Power */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 text-xl font-bold text-orange-400">
          Manna to Power
        </h2>

        <input
          type="number"
          min="5"
          max="8"
          step="1"
          value={power}
          onChange={(e) =>
            setPower(
              Math.max(5, Math.min(8, Math.floor(Number(e.target.value) || 5))),
            )
          }
          className="
            w-24
            rounded
            border
            border-gray-600
            bg-gray-800
            px-3
            py-2
            text-center
            text-lg
            text-white
            outline-none
            transition
            focus:border-cyan-500
            focus:ring-2
            focus:ring-cyan-500/50
          "
        />

        <p className="mt-2 text-sm text-gray-400">
          Starts at 5 Power. Each additional Power costs{" "}
          <span className="font-semibold text-cyan-300">{powerRate}</span>{" "}
          Manna.
        </p>
      </div>

      {/* ================================================== */}
      {/* Manna to Damage */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 text-xl font-bold text-orange-400">
          Manna to Damage
        </h2>

        <input
          type="number"
          min="0"
          step="1"
          value={damage}
          onChange={(e) =>
            setDamage(Math.max(0, Math.floor(Number(e.target.value) || 0)))
          }
          className="
            w-24
            rounded
            border
            border-gray-600
            bg-gray-800
            px-3
            py-2
            text-center
            text-lg
            text-white
            outline-none
            transition
            focus:border-cyan-500
            focus:ring-2
            focus:ring-cyan-500/50
          "
        />

        <p className="mt-2 text-sm text-gray-400">
          Each additional damage costs{" "}
          <span className="font-semibold text-cyan-300">{damageRate}</span>{" "}
          Manna.
        </p>
      </div>

      {/* ================================================== */}
      {/* Final Spell Statistics */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-orange-400">
            Final Spell Statistics
          </h2>

          {/* Technique Toggles */}

          <div className="flex flex-wrap gap-2">
            {/* Spell Surge */}

            <button
              type="button"
              onClick={() => setSpellSurge((prev) => !prev)}
              className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition ${
                spellSurge
                  ? "border-cyan-400 bg-cyan-500/10 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.5)]"
                  : "border-gray-600 bg-gray-900 text-gray-400 hover:border-cyan-500 hover:text-cyan-300"
              }`}
            >
              Spell Surge
            </button>
          </div>
        </div>

        {/* ================================================== */}
        {/* Technique Effects */}
        {/* ================================================== */}

        <div className="space-y-3">
          {spellSurge && (
            <p className="border-t border-gray-700 pt-3 text-sm text-cyan-300">
              Reduces the Manna cost of successive spells after the{" "}
              <span className="font-semibold">4TH SPELL</span> by{" "}
              <span className="font-semibold">30%</span>, and reduces it by
              another <span className="font-semibold">30%</span> after the{" "}
              <span className="font-semibold">8TH SPELL</span>.
            </p>
          )}
        </div>

        {/* ================================================== */}
        {/* Statistics */}
        {/* ================================================== */}

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">Power</p>
            <p className="text-xl font-bold text-white">{power}</p>
          </div>

          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">Damage</p>
            <p className="text-xl font-bold text-white">{finalDamage}</p>
          </div>

          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">Base Cost</p>
            <p className="text-xl font-bold text-white">{baseCost}</p>
          </div>

          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">Final Cost</p>
            <p className="text-xl font-bold text-white">{finalCost}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransmutePart;
