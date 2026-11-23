import { useEffect, useState } from "react";
import { LinkIcon } from "@heroicons/react/24/solid";

import { Mastery, Spell, Potency } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// Types
// ==================================================

type PotencyType = "MINOR" | "MAJOR" | "EXTREME";
type MasteryType = "NOVICE" | "INTERMEDIATE" | "MASTERED";

type CatalystType = "MENTAL" | "BODY" | "SPIRIT" | "MEMORY" | "NECRO";

type DefensiveAction = "DEFEND" | "COVER";

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
  "Aura Surge": true,
};

// ==================================================
// Potency Data
// ==================================================

const potencyStats = {
  MINOR: {
    NOVICE: 30,
    INTERMEDIATE: 25,
    MASTERED: 20,
  },
  MAJOR: {
    NOVICE: 45,
    INTERMEDIATE: 40,
    MASTERED: 35,
  },
  EXTREME: {
    NOVICE: 60,
    INTERMEDIATE: 55,
    MASTERED: 50,
  },
};

// ==================================================
// Potency Options
// ==================================================

const potencyOptions = [
  {
    value: "MINOR" as const,
    label: "Minor",
    description: "30 / 25 / 20",
  },
  {
    value: "MAJOR" as const,
    label: "Major",
    description: "45 / 40 / 35",
  },
  {
    value: "EXTREME" as const,
    label: "Extreme",
    description: "60 / 55 / 50",
  },
];

// ==================================================
// Constants
// ==================================================

const CHARGE_MULTIPLIER = 0.3;
const AURA_DAMAGE_REDUCTION = 0.2;

const CATALYST_DAMAGE: Record<CatalystType, string[]> = {
  MENTAL: ["PRESSURE", "VORPAL"],
  BODY: ["EXPLOSIVE", "THERMAL"],
  SPIRIT: ["KINETIC", "CONCUSSIVE"],
  MEMORY: ["KINETIC", "GRAVITY"],
  NECRO: ["KINETIC", "PRESSURE"],
};

// ==================================================
// Component
// ==================================================

const Adherence = ({
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

  const [selectedPotency, setSelectedPotency] = useState<PotencyType>("MINOR");

  const [spellCharge, setSpellCharge] = useState(false);
  const [spellRecovery, setSpellRecovery] = useState(false);
  const [spellSurge, setSpellSurge] = useState(false);

  const [fullCast, setFullCast] = useState(false);
  const [auraSurge, setAuraSurge] = useState(false);

  const [chargeTurns, setChargeTurns] = useState(0);
  const [doubleCast, setDoubleCast] = useState(false);

  const [existingEnchantments, setExistingEnchantments] = useState(0);

  const [selectedCatalyst, setSelectedCatalyst] =
    useState<CatalystType>("MENTAL");

  const [defensiveAction, setDefensiveAction] =
    useState<DefensiveAction>("DEFEND");

  // ==================================================
  // Mastery
  // ==================================================

  const mastery = ParentMastery.getType() as MasteryType;

  // ==================================================
  // Derived Values
  // ==================================================

  const baseCost = potencyStats[selectedPotency][mastery] ?? 0;

  // ==================================================
  // Spell Charge Calculations
  // ==================================================

  const chargeBonus = spellCharge ? chargeTurns * CHARGE_MULTIPLIER : 0;

  const chargePercentage = Math.round(chargeBonus * 100);

  const finalCost = Math.ceil(baseCost * (1 + chargeBonus));

  // Adherence does not define a numerical
  // enchantment strength, so this is displayed
  // as a percentage modifier.
  const strengthMultiplier = 1 + chargeBonus;

  // ==================================================
  // Spell Surge Calculations
  // ==================================================

  const surgeEligible = spellSurge && existingEnchantments >= 2;

  const aoeIncrease = surgeEligible ? 1 : 0;

  // ==================================================
  // Full Cast Calculations
  // ==================================================

  const additionalDefensiveActions = fullCast ? 1 : 0;

  // ==================================================
  // Aura Surge Calculations
  // ==================================================

  const protectedDamageTypes = CATALYST_DAMAGE[selectedCatalyst];

  const damageReduction = auraSurge ? AURA_DAMAGE_REDUCTION * 100 : 0;

  // ==================================================
  // Parent Spell Update
  // ==================================================

  useEffect(() => {
    updateSpell("cost", active ? finalCost : 0);

    if (!active) return;

    const potency = new Potency();

    switch (selectedPotency) {
      case "MINOR":
        potency.minor();
        break;

      case "MAJOR":
        potency.major();
        break;

      case "EXTREME":
        potency.extreme();
        break;
    }

    updateSpell("potency", potency);
  }, [active, finalCost, selectedPotency, updateSpell]);

  // ==================================================
  // Reset
  // ==================================================

  useEffect(() => {
    if (!active) {
      setSelectedPotency("MINOR");

      setSpellCharge(false);
      setSpellRecovery(false);
      setSpellSurge(false);
      setFullCast(false);
      setAuraSurge(false);

      setChargeTurns(0);
      setDoubleCast(false);
      setExistingEnchantments(0);

      setSelectedCatalyst("MENTAL");
      setDefensiveAction("DEFEND");
    }
  }, [active]);

  // ==================================================
  // Handlers
  // ==================================================

  const toggleSpellCharge = () => {
    if (spellCharge) {
      setSpellCharge(false);
      setChargeTurns(0);
      setDoubleCast(false);
    } else {
      setSpellCharge(true);
    }
  };

  const changeChargeTurns = (value: number) => {
    setChargeTurns(Math.max(0, Math.trunc(value || 0)));
  };

  const changeExistingEnchantments = (value: number) => {
    setExistingEnchantments(Math.max(0, Math.trunc(value || 0)));
  };

  // ==================================================
  // Render
  // ==================================================

  return (
    <>
      {/* ================================================== */}
      {/* Spell Title */}
      {/* ================================================== */}

      <div className="flex items-center gap-3">
        <LinkIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">Adherence</h1>
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

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        {/* ================================================== */}
        {/* Header & Technique Buttons */}
        {/* ================================================== */}

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-700 pb-3">
          <h3 className="text-lg font-semibold text-orange-400">
            Spell Properties
          </h3>

          <div className="flex flex-wrap gap-2">
            {/* Spell Charge */}

            <button
              type="button"
              onClick={toggleSpellCharge}
              aria-pressed={spellCharge}
              className={`rounded-md px-3 py-1 text-sm font-semibold transition-colors ${
                spellCharge
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-purple-600 hover:text-white"
              }`}
            >
              Spell Charge
            </button>

            {/* Spell Recovery */}

            <button
              type="button"
              onClick={() => setSpellRecovery((previous) => !previous)}
              aria-pressed={spellRecovery}
              className={`rounded-md px-3 py-1 text-sm font-semibold transition-colors ${
                spellRecovery
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-purple-600 hover:text-white"
              }`}
            >
              Spell Recovery
            </button>

            {/* Spell Surge */}

            <button
              type="button"
              onClick={() => setSpellSurge((previous) => !previous)}
              aria-pressed={spellSurge}
              className={`rounded-md px-3 py-1 text-sm font-semibold transition-colors ${
                spellSurge
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-purple-600 hover:text-white"
              }`}
            >
              Spell Surge
            </button>

            {/* Full Cast */}

            <button
              type="button"
              onClick={() => setFullCast((previous) => !previous)}
              aria-pressed={fullCast}
              className={`rounded-md px-3 py-1 text-sm font-semibold transition-colors ${
                fullCast
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-purple-600 hover:text-white"
              }`}
            >
              Full Cast
            </button>

            {/* Aura Surge */}

            <button
              type="button"
              onClick={() => setAuraSurge((previous) => !previous)}
              aria-pressed={auraSurge}
              className={`rounded-md px-3 py-1 text-sm font-semibold transition-colors ${
                auraSurge
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-purple-600 hover:text-white"
              }`}
            >
              Aura Surge
            </button>
          </div>
        </div>

        {/* ================================================== */}
        {/* Technique Descriptions */}
        {/* ================================================== */}

        {(spellCharge ||
          spellRecovery ||
          spellSurge ||
          fullCast ||
          auraSurge) && (
          <div className="mb-5 space-y-3">
            {/* ================================================== */}
            {/* Spell Charge */}
            {/* ================================================== */}

            {spellCharge && (
              <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-3">
                <p className="text-sm leading-relaxed text-gray-300">
                  <strong className="text-purple-400">Spell Charge:</strong>{" "}
                  Increases Adherence&apos;s strength by{" "}
                  <strong className="text-purple-300">
                    30% per complete turn
                  </strong>{" "}
                  of additional charging. Mana cost also increases by 30% per
                  charge. Other spells cannot be cast while charging unless{" "}
                  <strong className="text-purple-300">Double Cast</strong> is
                  used.
                </p>
              </div>
            )}

            {/* ================================================== */}
            {/* Spell Recovery */}
            {/* ================================================== */}

            {spellRecovery && (
              <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-3">
                <p className="text-sm leading-relaxed text-gray-300">
                  <strong className="text-purple-400">Spell Recovery:</strong>{" "}
                  Automatically reapplies the enchantment when the target enters
                  the caster&apos;s vicinity.
                </p>
              </div>
            )}

            {/* ================================================== */}
            {/* Spell Surge */}
            {/* ================================================== */}

            {spellSurge && (
              <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-3">
                <p className="text-sm leading-relaxed text-gray-300">
                  <strong className="text-purple-400">Spell Surge:</strong>{" "}
                  Increases the enchantment&apos;s AOE level when the recipient
                  already has{" "}
                  <strong className="text-purple-300">
                    two or more enchantments
                  </strong>{" "}
                  from the caster. Reapply using a Main Action or automatically
                  with{" "}
                  <strong className="text-purple-300">Spell Recovery</strong>.
                </p>
              </div>
            )}

            {/* ================================================== */}
            {/* Full Cast */}
            {/* ================================================== */}

            {fullCast && (
              <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-4">
                <h4 className="mb-2 font-semibold text-purple-400">
                  Full Cast
                </h4>

                <p className="text-sm leading-relaxed text-gray-300">
                  <strong className="text-purple-300">Once per turn</strong>,
                  targets receive an additional{" "}
                  <strong className="text-purple-300">DEFENSIVE ACTION</strong>{" "}
                  when an armor enchantment is{" "}
                  <strong className="text-purple-300">first</strong> cast on
                  them. Using this additional action{" "}
                  <strong className="text-red-400">REMOVES</strong> the
                  enchantment.
                </p>

                <div className="mt-4 space-y-3 rounded-lg border border-gray-700 bg-gray-900 p-4 text-sm text-gray-300">
                  <div className="flex justify-between">
                    <span>Additional Defensive Actions</span>

                    <span className="font-semibold text-purple-400">
                      +{additionalDefensiveActions}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Activation</span>

                    <span className="font-semibold text-cyan-400">
                      FIRST CAST
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Frequency</span>

                    <span className="font-semibold text-cyan-400">
                      ONCE PER TURN
                    </span>
                  </div>

                  <div className="flex justify-between border-t border-gray-700 pt-3">
                    <span>After Using Action</span>

                    <span className="font-semibold text-red-400">
                      ENCHANTMENT REMOVED
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ================================================== */}
            {/* Aura Surge */}
            {/* ================================================== */}

            {auraSurge && (
              <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-4">
                <h4 className="mb-2 font-semibold text-purple-400">
                  Aura Surge
                </h4>

                <p className="mb-4 text-sm leading-relaxed text-gray-300">
                  While an armor enchantment is active, reduces damage by{" "}
                  <strong className="text-purple-300">20%</strong> to the damage
                  types associated with the selected catalyst when using the{" "}
                  <strong className="text-purple-300">DEFEND</strong> or{" "}
                  <strong className="text-purple-300">COVER</strong> action.
                </p>

                {/* ================================================== */}
                {/* Catalyst Selection */}
                {/* ================================================== */}

                <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                  <h5 className="mb-3 font-semibold text-orange-400">
                    Catalyst
                  </h5>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                    {(Object.keys(CATALYST_DAMAGE) as CatalystType[]).map(
                      (catalyst) => (
                        <button
                          key={catalyst}
                          type="button"
                          onClick={() => setSelectedCatalyst(catalyst)}
                          className={`rounded-md border px-3 py-2 text-sm font-semibold transition-colors ${
                            selectedCatalyst === catalyst
                              ? "border-purple-400 bg-purple-950 text-purple-300"
                              : "border-gray-600 bg-gray-800 text-gray-300 hover:border-purple-600"
                          }`}
                        >
                          {catalyst}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                {/* ================================================== */}
                {/* Defensive Action */}
                {/* ================================================== */}

                <div className="mt-4 rounded-lg border border-gray-700 bg-gray-900 p-4">
                  <h5 className="mb-3 font-semibold text-orange-400">
                    Defensive Action
                  </h5>

                  <div className="grid grid-cols-2 gap-3">
                    {(["DEFEND", "COVER"] as DefensiveAction[]).map(
                      (action) => (
                        <button
                          key={action}
                          type="button"
                          onClick={() => setDefensiveAction(action)}
                          className={`rounded-md border px-3 py-2 text-sm font-semibold transition-colors ${
                            defensiveAction === action
                              ? "border-purple-400 bg-purple-950 text-purple-300"
                              : "border-gray-600 bg-gray-800 text-gray-300 hover:border-purple-600"
                          }`}
                        >
                          {action}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                {/* ================================================== */}
                {/* Damage Reduction Summary */}
                {/* ================================================== */}

                <div className="mt-4 space-y-3 rounded-lg border border-gray-700 bg-gray-900 p-4 text-gray-300">
                  <div className="flex justify-between">
                    <span>Selected Catalyst</span>

                    <span className="font-semibold text-cyan-400">
                      {selectedCatalyst}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Action</span>

                    <span className="font-semibold text-cyan-400">
                      {defensiveAction}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Damage Reduction</span>

                    <span className="font-semibold text-purple-400">
                      {damageReduction}%
                    </span>
                  </div>

                  <div className="border-t border-gray-700 pt-3">
                    <span className="mb-3 block font-semibold text-gray-300">
                      Protected Damage Types
                    </span>

                    <div className="flex flex-wrap gap-2">
                      {protectedDamageTypes.map((type) => (
                        <span
                          key={type}
                          className="rounded-md border border-purple-700 bg-purple-950 px-3 py-1 text-sm font-semibold text-purple-300"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================== */}
        {/* Spell Statistics */}
        {/* ================================================== */}

        <div className="space-y-3 text-gray-300">
          {/* Mastery */}

          <div className="flex justify-between">
            <span>Mastery</span>

            <span className="font-semibold text-cyan-400">{mastery}</span>
          </div>

          {/* Potency */}

          <div className="flex justify-between">
            <span>Potency</span>

            <span className="font-semibold text-cyan-400">
              {selectedPotency}
            </span>
          </div>

          {/* Base Cost */}

          <div className="flex justify-between">
            <span>Base Cost</span>

            <span className="font-semibold text-cyan-400">{baseCost}</span>
          </div>

          {/* Spell Charge */}

          {spellCharge && (
            <>
              <div className="flex justify-between">
                <span>Charge Turns</span>

                <span className="font-semibold text-cyan-400">
                  {chargeTurns}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Strength Increase</span>

                <span className="font-semibold text-purple-400">
                  +{chargePercentage}%
                </span>
              </div>
            </>
          )}

          {/* Spell Recovery */}

          {spellRecovery && (
            <div className="flex justify-between">
              <span>Automatic Reapplication</span>

              <span className="font-semibold text-purple-400">ENABLED</span>
            </div>
          )}

          {/* Spell Surge */}

          {spellSurge && (
            <>
              <div className="flex justify-between">
                <span>Existing Enchantments</span>

                <span className="font-semibold text-cyan-400">
                  {existingEnchantments}
                </span>
              </div>

              <div className="flex justify-between">
                <span>AOE Level Increase</span>

                <span
                  className={`font-semibold ${
                    surgeEligible ? "text-purple-400" : "text-gray-500"
                  }`}
                >
                  +{aoeIncrease}
                </span>
              </div>
            </>
          )}

          {/* Full Cast */}

          {fullCast && (
            <div className="flex justify-between gap-4">
              <span>Additional Defensive Action</span>

              <span className="text-right font-semibold text-purple-400">
                +1 (FIRST CAST)
              </span>
            </div>
          )}

          {/* Aura Surge */}

          {auraSurge && (
            <>
              <div className="flex justify-between">
                <span>Aura Surge Catalyst</span>

                <span className="font-semibold text-cyan-400">
                  {selectedCatalyst}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Damage Reduction</span>

                <span className="font-semibold text-purple-400">
                  {damageReduction}%
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span>Protected Damage Types</span>

                <span className="text-right font-semibold text-purple-400">
                  {protectedDamageTypes.join(", ")}
                </span>
              </div>
            </>
          )}

          {/* Final Cost */}

          <div className="flex justify-between border-t border-gray-700 pt-3">
            <span className="font-semibold text-gray-100">Final Cost</span>

            <span className="text-lg font-bold text-orange-400">
              {finalCost}
            </span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Potency Selection */}
      {/* ================================================== */}

      <div className="mt-6">
        <PotencySelector
          options={potencyOptions}
          selectedPotency={selectedPotency}
          setSelectedPotency={setSelectedPotency}
        />
      </div>

      {/* ================================================== */}
      {/* Spell Charge Configuration */}
      {/* ================================================== */}

      {spellCharge && (
        <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
          <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
            Spell Charge Configuration
          </h3>

          {/* Charge Turns */}

          <label className="block">
            <span className="mb-2 block font-semibold text-gray-300">
              Complete Turns of Charge
            </span>

            <input
              type="number"
              min={0}
              step={1}
              value={chargeTurns}
              onChange={(e) => changeChargeTurns(Number(e.target.value))}
              className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100 focus:border-cyan-500 focus:outline-none"
            />
          </label>

          {/* Double Cast */}

          <label className="mt-4 flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-gray-700 bg-gray-900 p-3">
            <div>
              <span className="block font-semibold text-gray-300">
                Double Cast
              </span>

              <p className="mt-1 text-sm text-gray-500">
                Allows casting other spells while charging Adherence.
              </p>
            </div>

            <input
              type="checkbox"
              checked={doubleCast}
              onChange={(e) => setDoubleCast(e.target.checked)}
              className="h-4 w-4 accent-purple-500"
            />
          </label>

          {/* Charge Summary */}

          <div className="mt-4 space-y-3 rounded-lg border border-gray-700 bg-gray-900 p-4">
            <div className="flex justify-between text-gray-300">
              <span>Strength Multiplier</span>

              <span className="font-semibold text-purple-400">
                {Number(strengthMultiplier.toFixed(2))}×
              </span>
            </div>

            <div className="flex justify-between text-gray-300">
              <span>Cost Increase</span>

              <span className="font-semibold text-purple-400">
                +{chargePercentage}%
              </span>
            </div>

            <div className="flex justify-between text-gray-300">
              <span>Final Cost</span>

              <span className="font-semibold text-cyan-400">{finalCost}</span>
            </div>
          </div>

          {/* Casting Restriction */}

          {!doubleCast && chargeTurns > 0 && (
            <p className="mt-4 rounded-lg border border-amber-800 bg-amber-950/30 p-3 text-sm text-amber-300">
              Other spells cannot be cast while charging unless Double Cast is
              used.
            </p>
          )}
        </div>
      )}

      {/* ================================================== */}
      {/* Spell Surge Configuration */}
      {/* ================================================== */}

      {spellSurge && (
        <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
          <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
            Spell Surge Configuration
          </h3>

          {/* Existing Enchantments */}

          <label className="block">
            <span className="mb-2 block font-semibold text-gray-300">
              Existing Enchantments from Caster
            </span>

            <input
              type="number"
              min={0}
              step={1}
              value={existingEnchantments}
              onChange={(e) =>
                changeExistingEnchantments(Number(e.target.value))
              }
              className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100 focus:border-cyan-500 focus:outline-none"
            />
          </label>

          {/* Surge Eligibility */}

          <div
            className={`mt-4 rounded-lg border p-4 ${
              surgeEligible
                ? "border-purple-600 bg-purple-950/30"
                : "border-gray-700 bg-gray-900"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-semibold text-gray-300">
                Spell Surge Eligibility
              </span>

              <span
                className={`font-semibold ${
                  surgeEligible ? "text-purple-400" : "text-gray-500"
                }`}
              >
                {surgeEligible ? "ELIGIBLE" : "NOT ELIGIBLE"}
              </span>
            </div>

            <p className="mt-2 text-sm text-gray-400">
              {surgeEligible
                ? "The target qualifies for a +1 AOE level increase when Adherence is reapplied."
                : "The target requires at least two existing enchantments from the caster."}
            </p>
          </div>

          {/* Reapplication Method */}

          <div className="mt-4 rounded-lg border border-gray-700 bg-gray-900 p-4">
            <h4 className="mb-2 font-semibold text-gray-300">
              Reapplication Method
            </h4>

            <p className="text-sm leading-relaxed text-gray-400">
              {spellRecovery
                ? "Adherence can be reapplied automatically when the target enters the caster's vicinity, or manually using a Main Action."
                : "Reapply Adherence using a Main Action. Enable Spell Recovery to allow automatic reapplication when the target enters the caster's vicinity."}
            </p>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* Spell Description */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Spell Description
        </h3>

        <p className="text-sm leading-relaxed text-gray-300">
          Allows the caster to place manna-channeled objects on armor so they
          may be carried without using up an orifice. The number of targets that
          can be attached to the same piece of armor scales with potency and
          environment.
        </p>

        <p className="mt-3 text-xs italic text-gray-500">|GMD|</p>
      </div>
    </>
  );
};

export default Adherence;
