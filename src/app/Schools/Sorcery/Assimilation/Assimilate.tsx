import { useEffect, useState } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/solid";

import { Mastery, Spell } from "@/app/models";
import Select from "@/app/Select";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// Types
// ==================================================

type AssimilateProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

type MasteryType = "NOVICE" | "INTERMEDIATE" | "MASTERED";

type AssimilateType = "Sustained" | "Mount" | "Sprint";

// ==================================================
// Assimilation Types
// ==================================================

const types: AssimilateType[] = ["Sustained", "Mount", "Sprint"];

// ==================================================
// Mastery Rates
// ==================================================

const masteryRates: Record<MasteryType, number> = {
  NOVICE: 20,
  INTERMEDIATE: 18,
  MASTERED: 15,
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
// Component
// ==================================================

export default function Assimilate({
  ParentMastery,
  active,
  updateSpell,
}: AssimilateProps) {
  // ==================================================
  // State
  // ==================================================

  const [ppp, setPPP] = useState(0);

  const [type, setType] = useState<AssimilateType>("Sustained");

  const [spellReflex, setSpellReflex] = useState(false);

  const [spellRecovery, setSpellRecovery] = useState(false);

  const [firstAttemptFailed, setFirstAttemptFailed] = useState(false);

  const [lostProgress, setLostProgress] = useState(0);

  const [continuingAssimilation, setContinuingAssimilation] = useState(false);

  // ==================================================
  // Mastery Calculations
  // ==================================================

  const mastery = ParentMastery.getType() as MasteryType;

  const rate = masteryRates[mastery];

  // ==================================================
  // PPP / TTT Calculations
  // ==================================================

  const finalTTT = Math.trunc(ppp * rate);

  const pppUnder50 = Math.trunc(ppp * 2);
  const pppOver50 = Math.trunc(ppp * 0.5);

  // ==================================================
  // Spell Reflex Calculations
  // ==================================================

  const extraCheckAvailable = spellReflex && firstAttemptFailed;

  const assimilationChecks = extraCheckAvailable ? 2 : 1;

  // ==================================================
  // Spell Recovery Calculations
  // ==================================================

  const recoveredProgress =
    spellRecovery && continuingAssimilation
      ? Math.trunc(lostProgress * RECOVERY_LIMIT)
      : 0;

  const remainingLostProgress = Math.max(
    0,
    Math.trunc(lostProgress - recoveredProgress),
  );

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
      setType("Sustained");

      setSpellReflex(false);
      setSpellRecovery(false);

      setFirstAttemptFailed(false);

      setLostProgress(0);
      setContinuingAssimilation(false);
    }
  }, [active]);

  // ==================================================
  // Handlers
  // ==================================================

  const handlePPPChange = (value: number) => {
    setPPP(Math.max(0, Math.trunc(Number.isFinite(value) ? value : 0)));
  };

  const handleLostProgressChange = (value: number) => {
    setLostProgress(
      Math.max(0, Math.trunc(Number.isFinite(value) ? value : 0)),
    );
  };

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
        <ArrowPathIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">Assimilation</h1>
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
                    20% of lost assimilation progress
                  </strong>{" "}
                  when assimilation is continued.
                </p>
              </div>
            )}

            {/* Spell Reflex */}

            {spellReflex && (
              <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-3">
                <p className="text-sm leading-relaxed text-gray-300">
                  <strong className="text-purple-400">Spell Reflex:</strong>{" "}
                  Grants one additional assimilation check when the first
                  attempt against a newly targeted subject fails.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ================================================== */}
        {/* Spell Statistics */}
        {/* ================================================== */}

        <div className="space-y-3 text-gray-300">
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

          {/* Assimilation Type */}

          <div className="flex justify-between gap-3">
            <span>Assimilation Type</span>

            <span className="font-semibold text-cyan-400">{type}</span>
          </div>

          {/* Movement Under 50% */}

          <div className="flex justify-between gap-3">
            <span>Movement Under 50%</span>

            <span className="font-semibold text-cyan-400">
              {pppUnder50} PPP
            </span>
          </div>

          {/* Movement Over 50% */}

          <div className="flex justify-between gap-3">
            <span>Movement Over 50%</span>

            <span className="font-semibold text-cyan-400">{pppOver50} PPP</span>
          </div>

          {/* Spell Recovery */}

          {spellRecovery && (
            <>
              <div className="flex justify-between gap-3">
                <span>Recovered Progress</span>

                <span className="font-semibold text-purple-400">
                  {Number(recoveredProgress)}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span>Remaining Lost Progress</span>

                <span className="font-semibold text-cyan-400">
                  {Number(remainingLostProgress)}
                </span>
              </div>
            </>
          )}

          {/* Spell Reflex */}

          {spellReflex && (
            <div className="flex justify-between gap-3">
              <span>Assimilation Checks</span>

              <span className="font-semibold text-purple-400">
                {assimilationChecks}
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
            onChange={(e) => handlePPPChange(Number(e.target.value))}
            className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100 focus:border-cyan-500 focus:outline-none"
          />
        </label>

        <p className="mt-2 text-sm text-gray-500">
          Each PPP requires {rate} TTT at the current Mastery.
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
      {/* PPP Movement */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          PPP Movement
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Under 50% */}

          <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
            <p className="text-sm font-semibold text-gray-300">
              While Under 50%
            </p>

            <p className="mt-2 text-2xl font-bold text-cyan-400">
              {pppUnder50} PPP
            </p>

            <p className="mt-1 text-xs text-gray-500">Invested PPP × 2</p>
          </div>

          {/* Over 50% */}

          <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
            <p className="text-sm font-semibold text-gray-300">
              While Over 50%
            </p>

            <p className="mt-2 text-2xl font-bold text-cyan-400">
              {pppOver50} PPP
            </p>

            <p className="mt-1 text-xs text-gray-500">Invested PPP × 0.5</p>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Assimilation Type */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Assimilation Type
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
              Lost Assimilation Progress
            </span>

            <input
              type="number"
              min={0}
              step={1}
              value={lostProgress}
              onChange={(e) => handleLostProgressChange(Number(e.target.value))}
              className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100 focus:border-cyan-500 focus:outline-none"
            />
          </label>

          {/* Continue Assimilation */}

          <label className="mt-4 flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-gray-700 bg-gray-900 p-4">
            <div>
              <span className="block font-semibold text-gray-300">
                Continue Assimilation
              </span>

              <p className="mt-1 text-sm text-gray-500">
                Recovery applies when assimilation is continued.
              </p>
            </div>

            <input
              type="checkbox"
              checked={continuingAssimilation}
              onChange={(e) => setContinuingAssimilation(e.target.checked)}
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
                {Number(recoveredProgress)}
              </span>
            </div>

            <div className="flex justify-between border-t border-gray-700 pt-3 text-gray-300">
              <span className="font-semibold text-gray-100">
                Remaining Lost Progress
              </span>

              <span className="text-lg font-bold text-orange-400">
                {Number(remainingLostProgress)}
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
                Initial Assimilation Check Failed
              </span>

              <p className="mt-1 text-sm text-gray-500">
                Enables the additional check when the first assimilation attempt
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
                Assimilation Checks
              </span>

              <span className="text-lg font-bold text-orange-400">
                {assimilationChecks}
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
            Assimilation converts invested TTT into PPP according to the
            caster's Mastery. Each invested PPP requires a fixed amount of TTT.
          </p>

          <p>
            The spell supports Sustained, Mount, and Sprint assimilation types.
          </p>

          <p>
            PPP movement is doubled while under 50% and halved while over 50%.
          </p>

          <p>
            Spell Recovery restores up to 20% of lost assimilation progress when
            assimilation is continued.
          </p>

          <p>
            Spell Reflex grants one additional assimilation check after the
            first failed attempt against a new target.
          </p>
        </div>
      </div>
    </>
  );
}
