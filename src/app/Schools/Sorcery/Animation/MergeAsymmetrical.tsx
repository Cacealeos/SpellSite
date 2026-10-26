import { useEffect, useState } from "react";
import { Square3Stack3DIcon } from "@heroicons/react/24/solid";

import { Mastery, Spell } from "@/app/models";
import DynamicValueEntries from "@/app/SpellCreation/DynamicValueEntry";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// Types
// ==================================================

type MergeSymmetricalProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

type MergePercentage = 100 | 50 | 10;

// ==================================================
// Spell Techniques
// ==================================================

const Techniques = {
  "Quick Spell": false,
  "Spell Reflex": true,
  "Double Cast": false,
  "Double Pulse": false,
  "Carry Spell": false,
  "Spell Shift": false,
  "Counter Spell": true,
  "Spell Surge": false,
  "Junction Cast": false,
  "Spell Charge": false,
  "Focus Spell": false,
  "Hyper Spell": false,
  "Auto Cast": false,
  "Rivet Cast": false,
  "Spell Recovery": true,
  "Father Spell": false,
};

// ==================================================
// Constants
// ==================================================

const RECOVERY_LIMIT = 0.2;

// ==================================================
// Component
// ==================================================

export default function MergeSymmetrical({
  ParentMastery,
  active,
  updateSpell,
}: MergeSymmetricalProps) {
  // ==================================================
  // State
  // ==================================================

  const [mergedTTT, setMergedTTT] = useState<number[]>([]);

  const [percentage, setPercentage] = useState<MergePercentage>(100);

  const [counterSpell, setCounterSpell] = useState(false);

  const [spellReflex, setSpellReflex] = useState(false);

  const [spellRecovery, setSpellRecovery] = useState(false);

  const [firstAttemptFailed, setFirstAttemptFailed] = useState(false);

  const [lostProgress, setLostProgress] = useState(0);

  const [continuingPossession, setContinuingPossession] = useState(false);

  // ==================================================
  // Mastery Effect
  // ==================================================

  const mastery = ParentMastery.getType();

  const availablePercentages: MergePercentage[] =
    mastery === "NOVICE"
      ? [100]
      : mastery === "INTERMEDIATE"
        ? [100, 50]
        : [100, 50, 10];

  const effectivePercentage = availablePercentages.includes(percentage)
    ? percentage
    : availablePercentages[0];

  // ==================================================
  // TTT Calculations
  // ==================================================

  const cumulativeTTT = mergedTTT.reduce((total, value) => total + value, 0);

  const finalTTT = Math.trunc(cumulativeTTT * (effectivePercentage / 100));

  // ==================================================
  // Spell Reflex Calculations
  // ==================================================

  const extraCheckAvailable = spellReflex && firstAttemptFailed;

  const possessionChecks = extraCheckAvailable ? 2 : 1;

  // ==================================================
  // Spell Recovery Calculations
  // ==================================================

  const recoveredProgress =
    spellRecovery && continuingPossession ? lostProgress * RECOVERY_LIMIT : 0;

  const remainingLostProgress = Math.max(0, lostProgress - recoveredProgress);

  // ==================================================
  // Parent Spell Update
  // ==================================================

  useEffect(() => {
    updateSpell("ttt", active ? finalTTT : 0);
  }, [active, finalTTT, updateSpell]);

  // ==================================================
  // Reset When Inactive
  // ==================================================

  useEffect(() => {
    if (!active) {
      setMergedTTT([]);
      setPercentage(100);

      setCounterSpell(false);
      setSpellReflex(false);
      setSpellRecovery(false);

      setFirstAttemptFailed(false);

      setLostProgress(0);
      setContinuingPossession(false);
    }
  }, [active]);

  // ==================================================
  // Handlers
  // ==================================================

  const normalizeNumber = (value: number) =>
    Math.max(0, Number.isFinite(value) ? value : 0);

  const techniqueButtonClass = (enabled: boolean) =>
    `rounded-md px-3 py-1 text-sm font-semibold transition-colors ${
      enabled
        ? "bg-purple-600 text-white"
        : "bg-gray-700 text-gray-300 hover:bg-purple-600 hover:text-white"
    }`;

  // ==================================================
  // Render
  // ==================================================

  return (
    <>
      {/* ================================================== */}
      {/* Spell Title */}
      {/* ================================================== */}

      <div className="flex items-center gap-3">
        <Square3Stack3DIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">Merge Symmetrical</h1>
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
            {/* Counter Spell */}

            <button
              type="button"
              onClick={() => setCounterSpell((previous) => !previous)}
              aria-pressed={counterSpell}
              className={techniqueButtonClass(counterSpell)}
            >
              Counter Spell
            </button>

            {/* Spell Reflex */}

            <button
              type="button"
              onClick={() => setSpellReflex((previous) => !previous)}
              aria-pressed={spellReflex}
              className={techniqueButtonClass(spellReflex)}
            >
              Spell Reflex
            </button>

            {/* Spell Recovery */}

            <button
              type="button"
              onClick={() => setSpellRecovery((previous) => !previous)}
              aria-pressed={spellRecovery}
              className={techniqueButtonClass(spellRecovery)}
            >
              Spell Recovery
            </button>
          </div>
        </div>

        {/* ================================================== */}
        {/* Technique Descriptions */}
        {/* ================================================== */}

        {(counterSpell || spellReflex || spellRecovery) && (
          <div className="mb-5 space-y-3">
            {/* Counter Spell */}

            {counterSpell && (
              <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-3">
                <p className="text-sm leading-relaxed text-gray-300">
                  <strong className="text-purple-400">Counter Spell:</strong>{" "}
                  Allows Animation spells to be used as a{" "}
                  <strong className="text-purple-300">Defensive Measure</strong>
                  .
                </p>
              </div>
            )}

            {/* Spell Reflex */}

            {spellReflex && (
              <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-3">
                <p className="text-sm leading-relaxed text-gray-300">
                  <strong className="text-purple-400">Spell Reflex:</strong>{" "}
                  Spells being cast may be targeted for possession. Grants one
                  additional possession check if the initial attempt fails the
                  first time a target is targeted.
                </p>
              </div>
            )}

            {/* Spell Recovery */}

            {spellRecovery && (
              <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-3">
                <p className="text-sm leading-relaxed text-gray-300">
                  <strong className="text-purple-400">Spell Recovery:</strong>{" "}
                  When possession is continued, recovers up to{" "}
                  <strong className="text-purple-300">
                    20% of lost possession progress
                  </strong>
                  .
                </p>
              </div>
            )}
          </div>
        )}

        {/* ================================================== */}
        {/* Spell Statistics */}
        {/* ================================================== */}

        <div className="space-y-3 text-gray-300">
          {/* Merged Spells */}

          <div className="flex justify-between gap-3">
            <span>Merged Spells</span>

            <span className="font-semibold text-cyan-400">
              {mergedTTT.length}
            </span>
          </div>

          {/* Cumulative TTT */}

          <div className="flex justify-between gap-3">
            <span>Cumulative TTT</span>

            <span className="font-semibold text-cyan-400">{cumulativeTTT}</span>
          </div>

          {/* Mastery Percentage */}

          <div className="flex justify-between gap-3">
            <span>TTT Multiplier</span>

            <span className="font-semibold text-cyan-400">
              {effectivePercentage}%
            </span>
          </div>

          {/* Counter Spell */}

          {counterSpell && (
            <div className="flex justify-between gap-3">
              <span>Defensive Measure</span>

              <span className="font-semibold text-purple-400">ENABLED</span>
            </div>
          )}

          {/* Spell Reflex */}

          {spellReflex && (
            <>
              <div className="flex justify-between gap-3">
                <span>Possession Checks</span>

                <span className="font-semibold text-purple-400">
                  {possessionChecks}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span>Can Target Casting Spells</span>

                <span className="font-semibold text-purple-400">YES</span>
              </div>
            </>
          )}

          {/* Spell Recovery */}

          {spellRecovery && (
            <>
              <div className="flex justify-between gap-3">
                <span>Recovered Progress</span>

                <span className="font-semibold text-purple-400">
                  {Number(recoveredProgress.toFixed(2))}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span>Remaining Lost Progress</span>

                <span className="font-semibold text-cyan-400">
                  {Number(remainingLostProgress.toFixed(2))}
                </span>
              </div>
            </>
          )}

          {/* Final TTT */}

          <div className="flex justify-between gap-3 border-t border-gray-700 pt-3">
            <span className="font-semibold text-gray-100">Final TTT</span>

            <span className="text-lg font-bold text-orange-400">
              {finalTTT}
            </span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Merged Spell Configuration */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Merged Spell Configuration
        </h3>

        <DynamicValueEntries
          title="Spell"
          values={mergedTTT}
          setValues={setMergedTTT}
        />

        {/* Merged Spell Summary */}

        <div className="mt-4 space-y-3 rounded-lg border border-gray-700 bg-gray-900 p-4">
          <div className="flex justify-between text-gray-300">
            <span>Number of Spells</span>

            <span className="font-semibold text-cyan-400">
              {mergedTTT.length}
            </span>
          </div>

          <div className="flex justify-between border-t border-gray-700 pt-3 text-gray-300">
            <span className="font-semibold text-gray-100">Cumulative TTT</span>

            <span className="text-lg font-bold text-orange-400">
              {cumulativeTTT}
            </span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Mastery Effect Configuration */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Mastery Effect
        </h3>

        <p className="mb-4 text-sm text-gray-400">
          Select the percentage of cumulative TTT required to merge the spells.
          Available percentages depend on the caster's Mastery.
        </p>

        {/* Percentage Selection */}

        <div className="flex flex-wrap gap-3">
          {availablePercentages.map((value) => (
            <label
              key={value}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${
                effectivePercentage === value
                  ? "border-orange-500 bg-orange-950/20"
                  : "border-gray-700 bg-gray-900 hover:border-gray-500"
              }`}
            >
              <input
                type="radio"
                name="merge-symmetrical-percentage"
                value={value}
                checked={effectivePercentage === value}
                onChange={() => setPercentage(value)}
                className="h-4 w-4 accent-orange-500"
              />

              <span
                className={`font-semibold ${
                  effectivePercentage === value
                    ? "text-orange-400"
                    : "text-gray-300"
                }`}
              >
                {value}%
              </span>
            </label>
          ))}
        </div>

        {/* TTT Summary */}

        <div className="mt-4 space-y-3 rounded-lg border border-gray-700 bg-gray-900 p-4">
          <div className="flex justify-between text-gray-300">
            <span>Cumulative TTT</span>

            <span className="font-semibold text-cyan-400">{cumulativeTTT}</span>
          </div>

          <div className="flex justify-between text-gray-300">
            <span>Selected Percentage</span>

            <span className="font-semibold text-cyan-400">
              {effectivePercentage}%
            </span>
          </div>

          <div className="flex justify-between border-t border-gray-700 pt-3 text-gray-300">
            <span className="font-semibold text-gray-100">Final TTT</span>

            <span className="text-lg font-bold text-orange-400">
              {finalTTT}
            </span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Spell Reflex Configuration */}
      {/* ================================================== */}

      {spellReflex && (
        <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
          <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
            Spell Reflex Configuration
          </h3>

          {/* First Attempt Failed */}

          <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-gray-700 bg-gray-900 p-4">
            <div>
              <span className="block font-semibold text-gray-300">
                Initial Possession Check Failed
              </span>

              <p className="mt-1 text-sm text-gray-500">
                Enables the additional check on the first failed attempt against
                a newly targeted subject.
              </p>
            </div>

            <input
              type="checkbox"
              checked={firstAttemptFailed}
              onChange={(e) => setFirstAttemptFailed(e.target.checked)}
              className="h-5 w-5 accent-purple-500"
            />
          </label>

          {/* Reflex Summary */}

          <div className="mt-4 space-y-3 rounded-lg border border-gray-700 bg-gray-900 p-4">
            <div className="flex justify-between text-gray-300">
              <span>Can Target Casting Spells</span>

              <span className="font-semibold text-purple-400">YES</span>
            </div>

            <div className="flex justify-between border-t border-gray-700 pt-3 text-gray-300">
              <span className="font-semibold text-gray-100">
                Possession Checks
              </span>

              <span className="text-lg font-bold text-orange-400">
                {possessionChecks}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* Spell Recovery Configuration */}
      {/* ================================================== */}

      {spellRecovery && (
        <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
          <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
            Spell Recovery Configuration
          </h3>

          {/* Lost Progress */}

          <label className="block">
            <span className="mb-2 block font-semibold text-gray-300">
              Lost Possession Progress
            </span>

            <input
              type="number"
              min={0}
              step={1}
              value={lostProgress}
              onChange={(e) =>
                setLostProgress(normalizeNumber(Number(e.target.value)))
              }
              className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100 focus:border-cyan-500 focus:outline-none"
            />
          </label>

          {/* Continue Possession */}

          <label className="mt-4 flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-gray-700 bg-gray-900 p-4">
            <div>
              <span className="block font-semibold text-gray-300">
                Continue Possession
              </span>

              <p className="mt-1 text-sm text-gray-500">
                Recovery applies when possession is continued.
              </p>
            </div>

            <input
              type="checkbox"
              checked={continuingPossession}
              onChange={(e) => setContinuingPossession(e.target.checked)}
              className="h-5 w-5 accent-purple-500"
            />
          </label>

          {/* Recovery Summary */}

          <div className="mt-4 space-y-3 rounded-lg border border-gray-700 bg-gray-900 p-4">
            <div className="flex justify-between text-gray-300">
              <span>Recovery Limit</span>

              <span className="font-semibold text-purple-400">20%</span>
            </div>

            <div className="flex justify-between text-gray-300">
              <span>Recovered Progress</span>

              <span className="font-semibold text-cyan-400">
                {Number(recoveredProgress.toFixed(2))}
              </span>
            </div>

            <div className="flex justify-between border-t border-gray-700 pt-3 text-gray-300">
              <span className="font-semibold text-gray-100">
                Remaining Lost Progress
              </span>

              <span className="text-lg font-bold text-orange-400">
                {Number(remainingLostProgress.toFixed(2))}
              </span>
            </div>
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

        <div className="space-y-3 text-sm leading-relaxed text-gray-300">
          <p>
            Merge Symmetrical combines multiple spells using their cumulative
            TTT. The final requirement is determined by the percentage available
            through the caster's Mastery.
          </p>

          <p>
            Counter Spell allows Animation spells to be used as a Defensive
            Measure.
          </p>

          <p>
            Spell Reflex permits possession of spells being cast and grants an
            extra check after the initial failed attempt against a new target.
          </p>

          <p>
            Spell Recovery restores up to 20% of lost possession progress when
            possession is continued.
          </p>
        </div>
      </div>
    </>
  );
}
