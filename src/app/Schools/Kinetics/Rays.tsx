import { useEffect, useState } from "react";
import { Mastery, Spell } from "@/app/models";

type RaysProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

const Rays = ({ ParentMastery, active, updateSpell }: RaysProps) => {
  // ==================================================
  // State
  // ==================================================

  const [power, setPower] = useState(0);
  const [damage, setDamage] = useState(0);

  const [spellCharge, setSpellCharge] = useState(false);
  const [hyperSpell, setHyperSpell] = useState(false);

  // ==================================================
  // Mastery / Rates
  // ==================================================

  const masteryType = ParentMastery.getType();

  const powerRate =
    masteryType === "NOVICE"
      ? 20
      : masteryType === "INTERMEDIATE"
        ? 15
        : masteryType === "MASTERED"
          ? 10
          : 0;

  const damageRate = 2;

  // ==================================================
  // Spell Statistics
  // ==================================================

  const powerValue = power * powerRate;
  const damageValue = damage * damageRate;

  const totalTTT = powerValue + damageValue;

  // Spell Charge grants +1 Power after charging for at least one turn.
  const chargedPower = spellCharge ? power + 1 : power;

  // Hyper Spell grants +1 Power with Ether, capped at 5.
  const hyperPower = hyperSpell ? Math.min(5, chargedPower + 1) : chargedPower;

  // Base damage before Hyper Spell's 30% increase.
  const baseDamage = hyperPower * 5 + damage / 2;

  // Hyper Spell increases Ray damage by 30%.
  const displayDamage = hyperSpell ? baseDamage * 1.3 : baseDamage;

  // ==================================================
  // Reset Local State
  // ==================================================

  useEffect(() => {
    if (active) return;

    setPower(0);
    setDamage(0);
    setSpellCharge(false);
    setHyperSpell(false);
  }, [active]);

  // ==================================================
  // Update Parent Spell
  // ==================================================

  useEffect(() => {
    if (!active) return;

    updateSpell("cost", 0);
    updateSpell("ttt", totalTTT);
  }, [active, totalTTT, updateSpell]);

  // ==================================================
  // Render
  // ==================================================

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-gray-200 shadow-lg">
      {/* ================================================== */}
      {/* Spell Title */}
      {/* ================================================== */}

      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h1 className="text-2xl font-bold text-cyan-400">Rays</h1>
      </div>

      {/* ================================================== */}
      {/* Power & Endurance & Damage */}
      {/* ================================================== */}

      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 text-lg font-bold text-cyan-300">
          Power & Endurance & Damage
        </h2>

        <div className="mb-4 rounded border border-gray-700 bg-gray-900 p-3">
          <p className="text-sm font-semibold text-gray-300">KINETIC DAMAGE</p>
          <p className="text-sm text-gray-400">RANGE - MISSILE</p>
        </div>

        {/* Power */}

        <div className="mb-5">
          <label className="mb-2 block text-sm font-semibold text-gray-300">
            Manna to Power & Endurance
          </label>

          <input
            type="number"
            min="0"
            max="3"
            step="1"
            value={power}
            onChange={(e) => setPower(Number(e.target.value) || 0)}
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
            {powerRate} TTT per Manna
          </p>
        </div>

        {/* Damage */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-300">
            Manna to Damage
          </label>

          <input
            type="number"
            min="0"
            max="100"
            step="1"
            value={damage}
            onChange={(e) => setDamage(Number(e.target.value) || 0)}
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
            {damageRate} TTT per Manna
          </p>
        </div>
      </div>

      {/* ================================================== */}
      {/* Spell Statistics */}
      {/* ================================================== */}

      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-orange-400">
            Spell Statistics
          </h2>

          <div className="flex flex-wrap gap-2">
            {/* Spell Charge */}

            <button
              type="button"
              onClick={() => setSpellCharge((prev) => !prev)}
              className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition ${
                spellCharge
                  ? "border-cyan-400 bg-cyan-500/10 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.5)]"
                  : "border-gray-600 bg-gray-900 text-gray-400 hover:border-cyan-500 hover:text-cyan-300"
              }`}
            >
              Spell Charge
            </button>

            {/* Hyper Spell */}

            <button
              type="button"
              onClick={() => setHyperSpell((prev) => !prev)}
              className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition ${
                hyperSpell
                  ? "border-purple-400 bg-purple-500/10 text-purple-300 shadow-[0_0_12px_rgba(192,132,252,0.5)]"
                  : "border-gray-600 bg-gray-900 text-gray-400 hover:border-purple-500 hover:text-purple-300"
              }`}
            >
              Hyper Spell
            </button>
          </div>
        </div>

        {/* Technique Effects */}

        <div className="space-y-3">
          {spellCharge && (
            <p className="border-t border-gray-700 pt-3 text-sm text-cyan-300">
              Increases Power by <span className="font-semibold">+1</span> if
              charged for at least <span className="font-semibold">1 TURN</span>
              .
            </p>
          )}

          {hyperSpell && (
            <p className="border-t border-gray-700 pt-3 text-sm text-purple-300">
              When used with <span className="font-semibold">ETHER</span>,
              increases Ray damage by <span className="font-semibold">30%</span>{" "}
              and Power by <span className="font-semibold">+1</span>, to a
              maximum Power of <span className="font-semibold">5</span>.
            </p>
          )}
        </div>

        {/* Statistics */}

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">Cost</p>
            <p className="text-xl font-bold text-white">0</p>
          </div>

          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">TTT</p>
            <p className="text-xl font-bold text-white">{totalTTT}</p>
          </div>

          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">Damage</p>
            <p className="text-xl font-bold text-white">{displayDamage}</p>
          </div>

          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">Power</p>
            <p className="text-xl font-bold text-white">{hyperPower}</p>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Secondary */}
      {/* ================================================== */}

      <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 text-lg font-bold text-orange-400">Secondary</h2>

        <div className="rounded border border-gray-700 bg-gray-900 p-3">
          <p className="text-sm font-semibold text-gray-300">KINETIC DAMAGE</p>
          <p className="text-sm text-gray-400">RANGE - MISSILE</p>
          <p className="text-sm text-gray-400">AOE - None</p>
        </div>
      </div>
    </div>
  );
};

export default Rays;
