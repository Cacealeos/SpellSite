import { useEffect, useState } from "react";
import { ShieldCheckIcon } from "@heroicons/react/24/solid";

import { Mastery, Spell } from "@/app/models";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// Spell Techniques
// ==================================================

const Techniques = {
  "Quick Spell": true,
  "Spell Reflex": false,
  "Double Cast": true,
  "Double Pulse": true,
  "Soul Cast": true,
  "Full Cast ": true,
  "Counter Spell": true,
  "Spell Surge": true,
  "Junction Cast": true,
  "Spell Charge": true,
  "Focus Spell": true,
  "Hyper Spell": true,
  "Auto Cast": false,
  "Rivet Cast": true,
  "Spell Recovery": true,
  "Aura Surge Cast": true,
};

// ==================================================
// Constants
// ==================================================

const BASE_VITALITY = 30;
const MAX_VITALITY = 1000;
const MAX_ENDURANCE = 8;

const MASTERY_COSTS = {
  NOVICE: {
    endurance: 90,
    vitality: 20,
  },
  INTERMEDIATE: {
    endurance: 60,
    vitality: 15,
  },
  MASTERED: {
    endurance: 30,
    vitality: 10,
  },
};

const FIELD_SIZES = {
  TINY: {
    label: "Tiny",
    multiplier: 0.5,
  },
  SIZEABLE: {
    label: "Sizeable",
    multiplier: 1,
  },
  ENORMOUS: {
    label: "Enormous",
    multiplier: 2,
  },
  GARGANTUAN: {
    label: "Gargantuan",
    multiplier: 4,
  },
};

type FieldSize = keyof typeof FIELD_SIZES;
type EnergyType = "MEMORY" | "SPIRIT";

const RESISTANT_DAMAGE = [
  "THERMAL",
  "VORPAL",
  "CONCUSSIVE",
  "KINETIC",
  "EXPLOSIVE",
];

const VULNERABLE_DAMAGE = ["PRESSURE", "GRAVITY", "ELECTRIC", "DIMENSIONAL"];

// ==================================================
// Component
// ==================================================

const ManifestForceField = ({
  ParentMastery,
  active,
  updateSpell,
}: {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
}) => {
  // ==================================================
  // State
  // ==================================================

  const [endurance, setEndurance] = useState(0);
  const [vitality, setVitality] = useState(BASE_VITALITY);

  const [fieldSize, setFieldSize] = useState<FieldSize>("SIZEABLE");

  // ==================================================
  // Technique State
  // ==================================================

  const [soulCast, setSoulCast] = useState(false);
  const [auraSurge, setAuraSurge] = useState(false);
  const [spellRecovery, setSpellRecovery] = useState(false);

  const [energyType, setEnergyType] = useState<EnergyType>("MEMORY");

  const [casterEndurance, setCasterEndurance] = useState(0);

  // ==================================================
  // Mastery
  // ==================================================

  const mastery = ParentMastery.getType() as
    | "NOVICE"
    | "INTERMEDIATE"
    | "MASTERED";

  const masteryStats = MASTERY_COSTS[mastery];

  // ==================================================
  // Field Size
  // ==================================================

  const selectedSize = FIELD_SIZES[fieldSize];

  // ==================================================
  // Cost Calculations
  // ==================================================

  const enduranceCost = endurance * masteryStats.endurance;

  const additionalVitality = vitality - BASE_VITALITY;

  const vitalityCost = additionalVitality * masteryStats.vitality;

  const subtotal = enduranceCost + vitalityCost;

  const finalCost = Math.ceil(subtotal * selectedSize.multiplier);

  // ==================================================
  // Soul Cast
  // ==================================================

  const soulCost = soulCast ? 50 : 0;

  // ==================================================
  // Aura Surge
  // ==================================================

  const memorySurgeActive =
    auraSurge && energyType === "MEMORY" && casterEndurance > endurance;

  const spiritSurgeActive = auraSurge && energyType === "SPIRIT";

  const vitalityBonus = memorySurgeActive ? Math.ceil(vitality * 0.4) : 0;

  const finalVitality = vitality + vitalityBonus;

  const enduranceBonus = memorySurgeActive ? 1 : 0;

  const finalEndurance = endurance + enduranceBonus;

  // ==================================================
  // Spell Recovery
  // ==================================================

  const recoveryCost = Math.ceil(finalCost * 0.5);

  // ==================================================
  // Resistance Thresholds
  // ==================================================

  const resistanceThreshold = finalEndurance + 2;
  const vulnerabilityThreshold = finalEndurance - 2;

  // ==================================================
  // Reset Techniques
  // ==================================================

  useEffect(() => {
    if (!active) {
      setSoulCast(false);
      setAuraSurge(false);
      setSpellRecovery(false);
    }
  }, [active]);

  // ==================================================
  // Spell Update
  // ==================================================

  useEffect(() => {
    if (!active) {
      updateSpell("cost", 0);
      return;
    }

    updateSpell("cost", finalCost);
  }, [active, finalCost, updateSpell]);

  // ==================================================
  // Render
  // ==================================================

  return (
    <>
      {/* ================================================== */}
      {/* Spell Title */}
      {/* ================================================== */}

      <div className="flex items-center gap-3">
        <ShieldCheckIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">
          Manifest Force Field
        </h1>
      </div>

      {/* ================================================== */}
      {/* Spell Techniques Table */}
      {/* ================================================== */}

      <div className="mt-6">
        <SpellTechniquesTable techniques={Techniques} />
      </div>

      {/* ================================================== */}
      {/* Field Configuration */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Field Configuration
        </h3>

        <div className="space-y-5">
          {/* ================================================== */}
          {/* Endurance */}
          {/* ================================================== */}

          <label className="block">
            <span className="mb-2 block font-semibold text-gray-300">
              Endurance (Max {MAX_ENDURANCE})
            </span>

            <input
              type="number"
              min={0}
              max={MAX_ENDURANCE}
              step={1}
              value={endurance}
              onChange={(e) =>
                setEndurance(
                  Math.min(
                    MAX_ENDURANCE,
                    Math.max(0, Math.trunc(Number(e.target.value) || 0)),
                  ),
                )
              }
              className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100 focus:border-cyan-500 focus:outline-none"
            />

            <span className="mt-1 block text-sm text-gray-400">
              {masteryStats.endurance} mana per Endurance point.
            </span>
          </label>

          {/* ================================================== */}
          {/* Vitality */}
          {/* ================================================== */}

          <label className="block">
            <span className="mb-2 block font-semibold text-gray-300">
              Vitality (Max {MAX_VITALITY})
            </span>

            <input
              type="number"
              min={BASE_VITALITY}
              max={MAX_VITALITY}
              step={1}
              value={vitality}
              onChange={(e) =>
                setVitality(
                  Math.min(
                    MAX_VITALITY,
                    Math.max(
                      BASE_VITALITY,
                      Math.trunc(Number(e.target.value) || BASE_VITALITY),
                    ),
                  ),
                )
              }
              className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100 focus:border-cyan-500 focus:outline-none"
            />

            <span className="mt-1 block text-sm text-gray-400">
              Base Vitality: {BASE_VITALITY}. Additional Vitality costs{" "}
              {masteryStats.vitality} mana per point.
            </span>
          </label>

          {/* ================================================== */}
          {/* Field Size */}
          {/* ================================================== */}

          <div>
            <span className="mb-3 block font-semibold text-gray-300">
              Field Size
            </span>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {(Object.keys(FIELD_SIZES) as FieldSize[]).map((size) => {
                const option = FIELD_SIZES[size];
                const selected = fieldSize === size;

                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setFieldSize(size)}
                    className={`rounded-lg border p-3 text-center transition-colors ${
                      selected
                        ? "border-cyan-400 bg-cyan-950 text-cyan-300"
                        : "border-gray-600 bg-gray-900 text-gray-300 hover:border-cyan-600"
                    }`}
                  >
                    <div className="font-semibold">{option.label}</div>

                    <div className="mt-1 text-sm opacity-80">
                      ×{option.multiplier}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Damage Interactions */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-cyan-400">
          Damage Interactions
        </h3>

        {/* ================================================== */}
        {/* Significantly Resistant */}
        {/* ================================================== */}

        <div className="rounded-lg border border-green-900 bg-green-950/30 p-4">
          <h4 className="mb-2 font-semibold text-green-400">
            Significantly Resistant
          </h4>

          <p className="mb-3 text-sm text-gray-300">
            The field is significantly resistant to damage with Power equal to
            or less than its Endurance + 2.
          </p>

          <div className="mb-3 flex justify-between border-b border-green-900 pb-2">
            <span className="text-gray-300">Power Threshold</span>

            <span className="font-bold text-green-400">
              ≤ {resistanceThreshold}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {RESISTANT_DAMAGE.map((type) => (
              <span
                key={type}
                className="rounded-md border border-green-800 bg-green-950 px-3 py-1 text-sm font-semibold text-green-300"
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        {/* ================================================== */}
        {/* Vulnerable */}
        {/* ================================================== */}

        <div className="mt-4 rounded-lg border border-red-900 bg-red-950/30 p-4">
          <h4 className="mb-2 font-semibold text-red-400">Vulnerable</h4>

          <p className="mb-3 text-sm text-gray-300">
            The field is vulnerable to damage with Power equal to or greater
            than its Endurance - 2.
          </p>

          <div className="mb-3 flex justify-between border-b border-red-900 pb-2">
            <span className="text-gray-300">Power Threshold</span>

            <span className="font-bold text-red-400">
              ≥ {vulnerabilityThreshold}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {VULNERABLE_DAMAGE.map((type) => (
              <span
                key={type}
                className="rounded-md border border-red-800 bg-red-950 px-3 py-1 text-sm font-semibold text-red-300"
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Spell Properties */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        {/* ================================================== */}
        {/* Header / Technique Buttons */}
        {/* ================================================== */}

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-gray-700 pb-3">
          <h3 className="text-lg font-semibold text-orange-400">
            Spell Properties
          </h3>

          <div className="flex flex-wrap gap-2">
            {/* Soul Cast */}

            <button
              type="button"
              aria-pressed={soulCast}
              onClick={() => setSoulCast((prev) => !prev)}
              className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                soulCast
                  ? "bg-purple-700 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-purple-700 hover:text-white"
              }`}
            >
              Soul Cast
            </button>

            {/* Aura Surge */}

            <button
              type="button"
              aria-pressed={auraSurge}
              onClick={() => setAuraSurge((prev) => !prev)}
              className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                auraSurge
                  ? "bg-orange-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-orange-600 hover:text-white"
              }`}
            >
              Aura Surge
            </button>

            {/* Spell Recovery */}

            <button
              type="button"
              aria-pressed={spellRecovery}
              onClick={() => setSpellRecovery((prev) => !prev)}
              className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                spellRecovery
                  ? "bg-fuchsia-700 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-fuchsia-700 hover:text-white"
              }`}
            >
              Spell Recovery
            </button>
          </div>
        </div>

        {/* ================================================== */}
        {/* Soul Cast */}
        {/* ================================================== */}

        {soulCast && (
          <div className="mb-5 rounded-lg border border-purple-700 bg-purple-950/30 p-4 text-sm text-purple-200">
            <p>
              <span className="font-semibold">Soul Cast:</span> At the cost of
              50 Soul, the caster leaves behind a temporary sentient
              consciousness.
            </p>

            <div className="mt-3 flex justify-between border-t border-purple-800 pt-3">
              <span>Soul Cost</span>

              <span className="font-bold text-purple-300">{soulCost} Soul</span>
            </div>
          </div>
        )}

        {/* ================================================== */}
        {/* Aura Surge */}
        {/* ================================================== */}

        {auraSurge && (
          <div className="mb-5 rounded-lg border border-orange-700 bg-orange-950/30 p-4 text-sm text-orange-200">
            <h4 className="mb-3 font-semibold text-orange-300">Aura Surge</h4>

            {/* ================================================== */}
            {/* Energy Selection */}
            {/* ================================================== */}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {(["MEMORY", "SPIRIT"] as const).map((type) => (
                <label
                  key={type}
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-3 py-3 ${
                    energyType === type
                      ? "border-orange-400 bg-orange-950/60 text-orange-200"
                      : "border-gray-600 bg-gray-900 text-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="force-field-aura-energy"
                    checked={energyType === type}
                    onChange={() => setEnergyType(type)}
                    className="accent-orange-500"
                  />

                  <span className="text-sm font-semibold">
                    {type === "MEMORY" ? "Memory Energy" : "Spirit Energy"}
                  </span>
                </label>
              ))}
            </div>

            {/* ================================================== */}
            {/* Memory Energy */}
            {/* ================================================== */}

            {energyType === "MEMORY" && (
              <div className="mt-4 space-y-4">
                <p>
                  While channeling Memory Energy, Manifest Constructs receive
                  +40% Vitality and +1 Endurance when the caster&apos;s
                  Endurance is greater.
                </p>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold">
                    Caster Endurance
                  </span>

                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={casterEndurance}
                    onChange={(e) =>
                      setCasterEndurance(
                        Math.max(0, Math.trunc(Number(e.target.value) || 0)),
                      )
                    }
                    className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100"
                  />
                </label>

                <div className="space-y-3 rounded-md border border-orange-800 bg-gray-900 p-4">
                  <div className="flex justify-between">
                    <span>Base Vitality</span>

                    <span>{vitality}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Vitality Bonus</span>

                    <span className="font-semibold text-orange-300">
                      +{vitalityBonus}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Final Vitality</span>

                    <span className="font-semibold text-orange-300">
                      {finalVitality}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Base Endurance</span>

                    <span>{endurance}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Endurance Bonus</span>

                    <span className="font-semibold text-orange-300">
                      +{enduranceBonus}
                    </span>
                  </div>

                  <div className="flex justify-between border-t border-orange-800 pt-3">
                    <span>Final Endurance</span>

                    <span className="font-bold text-orange-300">
                      {finalEndurance}
                    </span>
                  </div>
                </div>

                <p
                  className={`text-xs font-semibold ${
                    memorySurgeActive ? "text-green-400" : "text-yellow-400"
                  }`}
                >
                  {memorySurgeActive
                    ? "Memory Energy bonus active."
                    : "Requires Caster Endurance greater than Construct Endurance."}
                </p>
              </div>
            )}

            {/* ================================================== */}
            {/* Spirit Energy */}
            {/* ================================================== */}

            {energyType === "SPIRIT" && (
              <div className="mt-4 rounded-lg border border-orange-800 bg-gray-900 p-4">
                <p>
                  While channeling Spirit Energy, Manifest Constructs become
                  highly resistant to disruption.
                </p>

                <div className="mt-3 flex justify-between border-t border-orange-800 pt-3">
                  <span>Disruption Resistance</span>

                  <span className="font-bold text-orange-300">
                    {spiritSurgeActive ? "HIGH" : "INACTIVE"}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================== */}
        {/* Spell Recovery */}
        {/* ================================================== */}

        {spellRecovery && (
          <div className="mb-5 rounded-lg border border-fuchsia-700 bg-fuchsia-950/30 p-4 text-sm text-fuchsia-200">
            <p>
              <span className="font-semibold">Spell Recovery:</span> Allows the
              re-casting of lost spells at 50% Manna cost.
            </p>

            <div className="mt-4 space-y-2 rounded-md border border-fuchsia-800 bg-gray-900 p-4">
              <div className="flex justify-between">
                <span>Normal Manna Cost</span>

                <span className="font-semibold text-gray-200">{finalCost}</span>
              </div>

              <div className="flex justify-between">
                <span>Recovery Discount</span>

                <span className="font-semibold text-fuchsia-300">50%</span>
              </div>

              <div className="flex justify-between border-t border-fuchsia-800 pt-3">
                <span className="font-semibold">Recovery Cost</span>

                <span className="font-bold text-fuchsia-300">
                  {recoveryCost} Manna
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ================================================== */}
        {/* Final Spell Statistics */}
        {/* ================================================== */}

        <div className="space-y-3 text-gray-300">
          <div className="flex justify-between">
            <span>Mastery</span>

            <span className="font-semibold text-cyan-400">{mastery}</span>
          </div>

          <div className="flex justify-between">
            <span>Endurance</span>

            <span className="font-semibold text-cyan-400">
              {endurance}
              {enduranceBonus > 0 && ` → ${finalEndurance}`}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Vitality</span>

            <span className="font-semibold text-cyan-400">
              {vitality}
              {vitalityBonus > 0 && ` → ${finalVitality}`}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Field Size</span>

            <span className="font-semibold text-cyan-400">
              {selectedSize.label}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Size Multiplier</span>

            <span className="font-semibold text-cyan-400">
              ×{selectedSize.multiplier}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Endurance Cost</span>

            <span className="font-semibold text-cyan-400">{enduranceCost}</span>
          </div>

          <div className="flex justify-between">
            <span>Vitality Cost</span>

            <span className="font-semibold text-cyan-400">{vitalityCost}</span>
          </div>

          {/* ================================================== */}
          {/* Soul Cast Cost */}
          {/* ================================================== */}

          {soulCast && (
            <div className="flex justify-between">
              <span>Soul Cast Cost</span>

              <span className="font-semibold text-purple-400">
                {soulCost} Soul
              </span>
            </div>
          )}

          {/* ================================================== */}
          {/* Aura Surge Status */}
          {/* ================================================== */}

          {auraSurge && (
            <div className="flex justify-between gap-4">
              <span>Aura Surge</span>

              <span className="text-right font-semibold text-orange-400">
                {energyType === "MEMORY"
                  ? memorySurgeActive
                    ? "MEMORY ACTIVE"
                    : "MEMORY INACTIVE"
                  : "SPIRIT ACTIVE"}
              </span>
            </div>
          )}

          {spiritSurgeActive && (
            <div className="flex justify-between gap-4">
              <span>Disruption Resistance</span>

              <span className="text-right font-semibold text-orange-400">
                HIGH
              </span>
            </div>
          )}

          {/* ================================================== */}
          {/* Subtotal */}
          {/* ================================================== */}

          <div className="flex justify-between border-t border-gray-700 pt-3">
            <span>Subtotal</span>

            <span className="font-semibold text-cyan-400">{subtotal}</span>
          </div>

          {/* ================================================== */}
          {/* Spell Recovery Cost */}
          {/* ================================================== */}

          {spellRecovery && (
            <div className="flex justify-between">
              <span>Spell Recovery Cost</span>

              <span className="font-semibold text-fuchsia-400">
                {recoveryCost} Manna
              </span>
            </div>
          )}

          {/* ================================================== */}
          {/* Final Cost */}
          {/* ================================================== */}

          <div className="flex justify-between border-t border-gray-700 pt-3">
            <span className="font-semibold text-gray-100">Final Cost</span>

            <span className="text-lg font-bold text-orange-400">
              {finalCost}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManifestForceField;
