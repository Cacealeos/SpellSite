import { useEffect, useState } from "react";
import { ShieldCheckIcon } from "@heroicons/react/24/solid";

import { Mastery, Spell } from "@/app/models";
import Select from "@/app/Select";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// Types
// ==================================================

type PossessSustainProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

type MasteryType = "NOVICE" | "INTERMEDIATE" | "MASTERED";

type SustainType = "Seal" | "Construct" | "Entity" | "Link" | "Orchestrate";

// ==================================================
// Possession Types
// ==================================================

const types: SustainType[] = [
  "Seal",
  "Construct",
  "Entity",
  "Link",
  "Orchestrate",
];

// ==================================================
// Mastery Rates
// ==================================================

const sustainRates: Record<SustainType, Record<MasteryType, number>> = {
  Seal: {
    NOVICE: 6,
    INTERMEDIATE: 4,
    MASTERED: 2,
  },
  Construct: {
    NOVICE: 6,
    INTERMEDIATE: 4,
    MASTERED: 2,
  },
  Entity: {
    NOVICE: 8,
    INTERMEDIATE: 6,
    MASTERED: 4,
  },
  Link: {
    NOVICE: 7,
    INTERMEDIATE: 5,
    MASTERED: 3,
  },
  Orchestrate: {
    NOVICE: 3,
    INTERMEDIATE: 2,
    MASTERED: 1,
  },
};

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
  "Counter Spell": false,
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
// Helpers
// ==================================================

const normalizeInteger = (value: number) =>
  Math.max(0, Math.trunc(Number.isFinite(value) ? value : 0));

const techniqueButtonClass = (enabled: boolean) =>
  `rounded-md px-3 py-1 text-sm font-semibold transition-colors ${
    enabled
      ? "bg-purple-600 text-white"
      : "bg-gray-700 text-gray-300 hover:bg-purple-600 hover:text-white"
  }`;

// ==================================================
// Component
// ==================================================

export default function PossessSustain({
  ParentMastery,
  active,
  updateSpell,
}: PossessSustainProps) {
  // ==================================================
  // State
  // ==================================================

  const [ppp, setPPP] = useState(0);

  const [type, setType] = useState<SustainType>("Seal");

  const [spellRecovery, setSpellRecovery] = useState(false);

  const [spellReflex, setSpellReflex] = useState(false);

  const [lostProgress, setLostProgress] = useState(0);

  const [continuingPossession, setContinuingPossession] = useState(false);

  const [firstAttemptFailed, setFirstAttemptFailed] = useState(false);

  // ==================================================
  // Mastery Calculations
  // ==================================================

  const mastery = ParentMastery.getType() as MasteryType;

  const rate = sustainRates[type][mastery];

  // ==================================================
  // PPP / TTT Calculations
  // ==================================================

  const finalTTT = Math.trunc(ppp * rate);

  // ==================================================
  // Spell Recovery Calculations
  // ==================================================

  const recoveredProgress =
    spellRecovery && continuingPossession
      ? Math.trunc(lostProgress * RECOVERY_LIMIT)
      : 0;

  const remainingLostProgress = Math.max(
    0,
    Math.trunc(lostProgress - recoveredProgress),
  );

  // ==================================================
  // Spell Reflex Calculations
  // ==================================================

  const extraCheckAvailable = spellReflex && firstAttemptFailed;

  const possessionChecks = extraCheckAvailable ? 2 : 1;

  // ==================================================
  // Parent Spell Update
  // ==================================================

  useEffect(() => {
    updateSpell("cost", 0);
    updateSpell("ttt", active ? finalTTT : 0);
  }, [active, finalTTT, updateSpell]);

  // ==================================================
  // Reset When Inactive
  // ==================================================

  useEffect(() => {
    if (!active) {
      setPPP(0);
      setType("Seal");

      setSpellRecovery(false);
      setSpellReflex(false);

      setLostProgress(0);
      setContinuingPossession(false);

      setFirstAttemptFailed(false);
    }
  }, [active]);

  // ==================================================
  // Render
  // ==================================================

  if (!active) return null;

  return (
    <>
      {/* ================================================== */}
      {/* Spell Title */}
      {/* ================================================== */}

      <div className="flex items-center gap-3">
        <ShieldCheckIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">Possession Sustain</h1>
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
            {/* Spell Recovery */}

            <button
              type="button"
              onClick={() => setSpellRecovery((previous) => !previous)}
              aria-pressed={spellRecovery}
              className={techniqueButtonClass(spellRecovery)}
            >
              Spell Recovery
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
          </div>
        </div>

        {/* ================================================== */}
        {/* Technique Descriptions */}
        {/* ================================================== */}

        {(spellRecovery || spellReflex) && (
          <div className="mb-5 space-y-3">
            {/* Spell Recovery */}

            {spellRecovery && (
              <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-3">
                <p className="text-sm leading-relaxed text-gray-300">
                  <strong className="text-purple-400">Spell Recovery:</strong>{" "}
                  Recovers up to{" "}
                  <strong className="text-purple-300">
                    20% of lost possession progress
                  </strong>{" "}
                  when possession is continued.
                </p>
              </div>
            )}

            {/* Spell Reflex */}

            {spellReflex && (
              <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-3">
                <p className="text-sm leading-relaxed text-gray-300">
                  <strong className="text-purple-400">Spell Reflex:</strong>{" "}
                  Grants one additional possession check when the first attempt
                  against a newly targeted subject fails.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ================================================== */}
        {/* Spell Statistics */}
        {/* ================================================== */}

        <div className="space-y-3 text-gray-300">
          {/* Possession Type */}

          <div className="flex justify-between gap-3">
            <span>Possession Type</span>

            <span className="font-semibold text-cyan-400">{type}</span>
          </div>

          {/* PPP */}

          <div className="flex justify-between gap-3">
            <span>Invested PPP</span>

            <span className="font-semibold text-cyan-400">{ppp}</span>
          </div>

          {/* TTT Rate */}

          <div className="flex justify-between gap-3">
            <span>TTT per PPP</span>

            <span className="font-semibold text-cyan-400">{rate}</span>
          </div>

          {/* Spell Recovery */}

          {spellRecovery && (
            <>
              <div className="flex justify-between gap-3">
                <span>Recovered Progress</span>

                <span className="font-semibold text-purple-400">
                  {recoveredProgress}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span>Remaining Lost Progress</span>

                <span className="font-semibold text-cyan-400">
                  {remainingLostProgress}
                </span>
              </div>
            </>
          )}

          {/* Spell Reflex */}

          {spellReflex && (
            <div className="flex justify-between gap-3">
              <span>Possession Checks</span>

              <span className="font-semibold text-purple-400">
                {possessionChecks}
              </span>
            </div>
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
      {/* PPP Configuration */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          PPP Configuration
        </h3>

        {/* PPP Input */}

        <label className="block">
          <span className="mb-2 block font-semibold text-gray-300">
            Invested PPP
          </span>

          <input
            type="number"
            min={0}
            step={1}
            value={ppp}
            onChange={(e) => setPPP(normalizeInteger(Number(e.target.value)))}
            className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100 focus:border-cyan-500 focus:outline-none"
          />
        </label>

        <p className="mt-2 text-sm text-gray-500">
          Each PPP requires {rate} TTT for sustained {type.toLowerCase()}{" "}
          possession.
        </p>

        {/* PPP Summary */}

        <div className="mt-4 space-y-3 rounded-lg border border-gray-700 bg-gray-900 p-4">
          <div className="flex justify-between text-gray-300">
            <span>Invested PPP</span>

            <span className="font-semibold text-cyan-400">{ppp}</span>
          </div>

          <div className="flex justify-between text-gray-300">
            <span>TTT per PPP</span>

            <span className="font-semibold text-cyan-400">{rate}</span>
          </div>

          <div className="flex justify-between border-t border-gray-700 pt-3 text-gray-300">
            <span className="font-semibold text-gray-100">Total TTT</span>

            <span className="text-lg font-bold text-orange-400">
              {finalTTT}
            </span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Possession Type */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Possession Type
        </h3>

        <Select choices={types} changeChoice={setType} title={type} />

        <div className="mt-4 rounded-lg border border-gray-700 bg-gray-900 p-4">
          <div className="flex justify-between gap-3 text-gray-300">
            <span>Selected Type</span>

            <span className="font-semibold text-cyan-400">{type}</span>
          </div>
        </div>
      </div>

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
                setLostProgress(normalizeInteger(Number(e.target.value)))
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
                {recoveredProgress}
              </span>
            </div>

            <div className="flex justify-between border-t border-gray-700 pt-3 text-gray-300">
              <span className="font-semibold text-gray-100">
                Remaining Lost Progress
              </span>

              <span className="text-lg font-bold text-orange-400">
                {remainingLostProgress}
              </span>
            </div>
          </div>
        </div>
      )}

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
                Enables the additional check when the first possession attempt
                against a new target fails.
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

          <div className="mt-4 rounded-lg border border-gray-700 bg-gray-900 p-4">
            <div className="flex justify-between text-gray-300">
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
      {/* Spell Description */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Spell Description
        </h3>

        <div className="space-y-3 text-sm leading-relaxed text-gray-300">
          <p>
            Possession Sustain invests TTT to generate PPP for maintaining
            possession over the selected target type.
          </p>

          <p>
            Available types are Seal, Construct, Entity, Link, and Orchestrate.
            Each type has its own TTT requirement per PPP based on Mastery.
          </p>

          <p>
            Spell Recovery restores up to 20% of lost possession progress when
            possession is continued.
          </p>

          <p>
            Spell Reflex grants one additional possession check after the first
            failed attempt against a new target.
          </p>
        </div>
      </div>
    </>
  );
}
