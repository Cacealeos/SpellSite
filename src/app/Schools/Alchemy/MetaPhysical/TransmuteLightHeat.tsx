import { useEffect, useState } from "react";
import { Mastery, Spell } from "@/app/models";
import { SunIcon } from "@heroicons/react/24/solid";
import Select from "@/app/Select";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// Types
// ==================================================

type TransmuteLightHeatProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

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
// Type Options
// ==================================================

const choices = ["Light", "Heat", "Cold"];

// ==================================================
// Mastery Rates
// ==================================================

const getRates = (masteryType: string) => {
  switch (masteryType) {
    case "NOVICE":
      return { power: 35, damage: 6 };

    case "INTERMEDIATE":
      return { power: 30, damage: 5 };

    case "MASTERED":
      return { power: 25, damage: 4 };

    default:
      return { power: 0, damage: 0 };
  }
};

const TransmuteLightHeat = ({
  ParentMastery,
  active,
  updateSpell,
}: TransmuteLightHeatProps) => {
  // ==================================================
  // State
  // ==================================================

  const [power, setPower] = useState(0);
  const [damage, setDamage] = useState(0);
  const [type, setType] = useState("");

  const [spellSurge, setSpellSurge] = useState(false);
  const [spellCharge, setSpellCharge] = useState(false);
  const [counterSpell, setCounterSpell] = useState(false);
  const [hyperSpell, setHyperSpell] = useState(false);

  const [successiveSpells, setSuccessiveSpells] = useState(0);
  const [charges, setCharges] = useState(0);

  // ==================================================
  // Spell Statistics
  // ==================================================

  const rates = getRates(ParentMastery.getType());

  const typeIndex = choices.indexOf(type);

  const maxPower = 8 - Math.max(typeIndex, 0);

  const damageType = typeIndex === 0 ? "ELECTRIC" : "THERMAL";

  const baseCost = power * rates.power + damage * rates.damage;

  // ==================================================
  // Spell Surge
  // ==================================================

  const surgeReduction = spellSurge
    ? Math.min(0.75, successiveSpells * 0.15)
    : 0;

  const mannaCost = Math.round(baseCost * (1 - surgeReduction));

  // ==================================================
  // Spell Charge
  // ==================================================

  const chargeBonus = spellCharge ? charges * 0.05 : 0;

  const finalDamage = Math.round(damage * (1 + chargeBonus));

  // ==================================================
  // Primary Statistics
  // ==================================================

  const aoe = power > 6 ? "Large" : power > 4 ? "Moderate" : "Small";

  const scaling = Math.round(finalDamage * 0.33);

  // ==================================================
  // Secondary Statistics
  // ==================================================

  const secondaryAOE = hyperSpell ? "Moderate" : "Small";

  const resCheck = power * 2;

  // ==================================================
  // Reset Local State
  // ==================================================

  useEffect(() => {
    if (active) return;

    setPower(0);
    setDamage(0);
    setType("");

    setSpellSurge(false);
    setSpellCharge(false);
    setCounterSpell(false);
    setHyperSpell(false);

    setSuccessiveSpells(0);
    setCharges(0);
  }, [active]);

  // ==================================================
  // Update Parent Spell
  // ==================================================

  useEffect(() => {
    if (!active) return;

    updateSpell("cost", mannaCost);

    // This spell does not intrinsically generate TTT.
    updateSpell("ttt", 0);
  }, [active, mannaCost, updateSpell]);

  // ==================================================
  // Render
  // ==================================================

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-gray-200 shadow-lg">
      {/* ================================================== */}
      {/* Spell Title */}
      {/* ================================================== */}

      <div className="flex items-center gap-3">
        <SunIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">
          Transmute Light & Heat & Cold
        </h1>
      </div>

      {/* ================================================== */}
      {/* Spell Techniques Table */}
      {/* ================================================== */}

      <div className="mt-6">
        <SpellTechniquesTable techniques={Techniques} />
      </div>

      {/* ================================================== */}
      {/* Spell Properties */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        {/* ================================================== */}
        {/* Spell Properties Header / Technique Toggles */}
        {/* ================================================== */}

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-700 pb-3">
          <h2 className="text-lg font-semibold text-cyan-400">
            Spell Properties
          </h2>

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

            {/* Spell Charge */}

            <button
              type="button"
              onClick={() => setSpellCharge((prev) => !prev)}
              className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition ${
                spellCharge
                  ? "border-yellow-400 bg-yellow-500/10 text-yellow-300 shadow-[0_0_12px_rgba(250,204,21,0.5)]"
                  : "border-gray-600 bg-gray-900 text-gray-400 hover:border-yellow-500 hover:text-yellow-300"
              }`}
            >
              Spell Charge
            </button>

            {/* Counter Spell */}

            <button
              type="button"
              onClick={() => setCounterSpell((prev) => !prev)}
              className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition ${
                counterSpell
                  ? "border-red-400 bg-red-500/10 text-red-300 shadow-[0_0_12px_rgba(248,113,113,0.5)]"
                  : "border-gray-600 bg-gray-900 text-gray-400 hover:border-red-500 hover:text-red-300"
              }`}
            >
              Counter Spell
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

        {/* ================================================== */}
        {/* Technique Effects */}
        {/* ================================================== */}

        <div className="space-y-3">
          {spellSurge && (
            <div className="border-b border-gray-700 pb-3">
              <p className="text-sm text-cyan-300">
                Reduces Manna cost and casting time by{" "}
                <span className="font-semibold">15%</span> per successive spell,
                up to a maximum reduction of{" "}
                <span className="font-semibold">75%</span>.
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <label className="text-sm text-gray-300">
                  Successive Spells
                </label>

                <input
                  type="number"
                  min="0"
                  max="5"
                  step="1"
                  value={successiveSpells}
                  onChange={(e) =>
                    setSuccessiveSpells(
                      Math.max(
                        0,
                        Math.min(5, Math.floor(Number(e.target.value) || 0)),
                      ),
                    )
                  }
                  className="w-20 rounded border border-gray-600 bg-gray-900 px-3 py-2 text-center text-white outline-none focus:border-cyan-500"
                />

                <span className="text-sm font-semibold text-cyan-300">
                  {Math.round(surgeReduction * 100)}% Reduction
                </span>
              </div>
            </div>
          )}

          {spellCharge && (
            <div className="border-b border-gray-700 pb-3">
              <p className="text-sm text-yellow-300">
                Increases damage by <span className="font-semibold">5%</span>{" "}
                per charge.
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <label className="text-sm text-gray-300">Charges</label>

                <input
                  type="number"
                  min="0"
                  step="1"
                  value={charges}
                  onChange={(e) =>
                    setCharges(
                      Math.max(0, Math.floor(Number(e.target.value) || 0)),
                    )
                  }
                  className="w-20 rounded border border-gray-600 bg-gray-900 px-3 py-2 text-center text-white outline-none focus:border-yellow-500"
                />

                <span className="text-sm font-semibold text-yellow-300">
                  +{Math.round(chargeBonus * 100)}% Damage
                </span>
              </div>
            </div>
          )}

          {counterSpell && (
            <p className="border-b border-gray-700 pb-3 text-sm text-red-300">
              Allows Metaphysical spells to be used as a{" "}
              <span className="font-semibold">DEFENSIVE ACTION</span>.
            </p>
          )}

          {hyperSpell && (
            <p className="border-b border-gray-700 pb-3 text-sm text-purple-300">
              Functions only with{" "}
              <span className="font-semibold">
                TRANSMUTE GRAVITY AND LIGHT/HEAT
              </span>
              . Increases the AOE of secondary effects.
            </p>
          )}
        </div>

        {/* ================================================== */}
        {/* Type Selection */}
        {/* ================================================== */}

        <div className="mt-5">
          <h2 className="mb-3 text-xl font-bold text-orange-400">Type</h2>

          <Select choices={choices} title="Type" changeChoice={setType} />
        </div>

        {/* ================================================== */}
        {/* Power */}
        {/* ================================================== */}

        <div className="mt-6 border-t border-gray-700 pt-6">
          <h2 className="mb-3 text-xl font-bold text-orange-400">Power</h2>

          <input
            type="number"
            min="0"
            max={maxPower}
            step="1"
            value={power}
            onChange={(e) =>
              setPower(
                Math.max(
                  0,
                  Math.min(maxPower, Math.floor(Number(e.target.value) || 0)),
                ),
              )
            }
            className="
              w-24 rounded border border-gray-600
              bg-gray-900 px-3 py-2 text-center
              text-lg text-white outline-none transition
              focus:border-cyan-500
              focus:ring-2 focus:ring-cyan-500/50
            "
          />

          <p className="mt-2 text-sm text-gray-400">
            Manna cost per Power: {rates.power}
          </p>
        </div>

        {/* ================================================== */}
        {/* Damage */}
        {/* ================================================== */}

        <div className="mt-6 border-t border-gray-700 pt-6">
          <h2 className="mb-3 text-xl font-bold text-orange-400">Damage</h2>

          <input
            type="number"
            min="0"
            step="1"
            value={damage}
            onChange={(e) =>
              setDamage(Math.max(0, Math.floor(Number(e.target.value) || 0)))
            }
            className="
              w-24 rounded border border-gray-600
              bg-gray-900 px-3 py-2 text-center
              text-lg text-white outline-none transition
              focus:border-cyan-500
              focus:ring-2 focus:ring-cyan-500/50
            "
          />

          <p className="mt-2 text-sm text-gray-400">
            Manna cost per Damage: {rates.damage}
          </p>
        </div>
      </div>

      {/* ================================================== */}
      {/* Primary Effects */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Primary
        </h2>

        <div className="space-y-3 text-gray-300">
          <div className="flex justify-between">
            <span>Effect</span>
            <span className="font-semibold text-orange-400">{type || "—"}</span>
          </div>

          <div className="flex justify-between">
            <span>Damage Type</span>
            <span className="font-semibold text-orange-400">{damageType}</span>
          </div>

          <div className="flex justify-between">
            <span>Range</span>
            <span className="font-semibold text-orange-400">Radial</span>
          </div>

          <div className="flex justify-between">
            <span>Power</span>
            <span className="font-semibold text-orange-400">{power}</span>
          </div>

          <div className="flex justify-between">
            <span>Damage</span>
            <span className="font-semibold text-orange-400">{finalDamage}</span>
          </div>

          <div className="flex justify-between">
            <span>Scaling</span>
            <span className="font-semibold text-orange-400">0 / {scaling}</span>
          </div>

          <div className="flex justify-between">
            <span>AOE</span>
            <span className="font-semibold text-orange-400">{aoe}</span>
          </div>

          <div className="flex justify-between border-t border-gray-700 pt-3">
            <span>Manna</span>
            <span className="font-semibold text-orange-400">{mannaCost}</span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Secondary Effects */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Secondary
        </h2>

        <div className="space-y-3 text-gray-300">
          <div className="flex justify-between">
            <span>Effect</span>
            <span className="font-semibold text-orange-400">{type || "—"}</span>
          </div>

          <div className="flex justify-between">
            <span>Damage Type</span>
            <span className="font-semibold text-orange-400">{damageType}</span>
          </div>

          <div className="flex justify-between">
            <span>Range</span>
            <span className="font-semibold text-orange-400">Direct</span>
          </div>

          <div className="flex justify-between">
            <span>AOE</span>
            <span className="font-semibold text-orange-400">
              {secondaryAOE}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Check</span>
            <span className="font-semibold text-orange-400">
              {resCheck} vs Res OR Dis
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransmuteLightHeat;
