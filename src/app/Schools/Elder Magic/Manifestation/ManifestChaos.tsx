import { useEffect, useState } from "react";
import {
  ArrowPathIcon,
  BoltIcon,
  SparklesIcon,
} from "@heroicons/react/24/solid";

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
  "Aura Surge": false,
};

// ==================================================
// Constants
// ==================================================

const MASTERY_COSTS = {
  NOVICE: {
    base: 100,
    manifest: 10,
    rectify: 12,
  },
  INTERMEDIATE: {
    base: 50,
    manifest: 7,
    rectify: 9,
  },
  MASTERED: {
    base: 0,
    manifest: 5,
    rectify: 7,
  },
};

type ChaosMode = "MANIFEST" | "RECTIFY";

// ==================================================
// Component
// ==================================================

const ManifestChaos = ({
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

  const [mode, setMode] = useState<ChaosMode>("MANIFEST");

  const [saturation, setSaturation] = useState(0);

  const [spellRecovery, setSpellRecovery] = useState(false);

  // ==================================================
  // Mastery
  // ==================================================

  const mastery = ParentMastery.getType() as
    | "NOVICE"
    | "INTERMEDIATE"
    | "MASTERED";

  const masteryStats = MASTERY_COSTS[mastery];

  // ==================================================
  // Mode Statistics
  // ==================================================

  const isManifest = mode === "MANIFEST";

  const modeName = isManifest ? "Manifest Chaos" : "Rectify Chaos";

  const manaPerSaturation = isManifest
    ? masteryStats.manifest
    : masteryStats.rectify;

  // ==================================================
  // Cost Calculations
  // ==================================================

  const baseCost = masteryStats.base;

  const saturationCost = saturation * manaPerSaturation;

  const finalCost = Math.ceil(baseCost + saturationCost);

  // ==================================================
  // Spell Recovery
  // ==================================================

  const recoveryCost = Math.ceil(finalCost * 0.5);

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
        <ArrowPathIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">Manipulate Chaos</h1>
      </div>

      {/* ================================================== */}
      {/* Spell Techniques Table */}
      {/* ================================================== */}

      <div className="mt-6">
        <SpellTechniquesTable techniques={Techniques} />
      </div>

      {/* ================================================== */}
      {/* Chaos Configuration */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Chaos Configuration
        </h3>

        {/* ================================================== */}
        {/* Mode Selection */}
        {/* ================================================== */}

        <div className="mb-5">
          <span className="mb-3 block font-semibold text-gray-300">
            Chaos Manipulation
          </span>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setMode("MANIFEST")}
              className={`flex items-center justify-center gap-2 rounded-lg border p-4 font-semibold transition-colors ${
                isManifest
                  ? "border-purple-400 bg-purple-950 text-purple-300"
                  : "border-gray-600 bg-gray-900 text-gray-300 hover:border-purple-600"
              }`}
            >
              <BoltIcon className="h-5 w-5" />
              Manifest Chaos
            </button>

            <button
              type="button"
              onClick={() => setMode("RECTIFY")}
              className={`flex items-center justify-center gap-2 rounded-lg border p-4 font-semibold transition-colors ${
                !isManifest
                  ? "border-cyan-400 bg-cyan-950 text-cyan-300"
                  : "border-gray-600 bg-gray-900 text-gray-300 hover:border-cyan-600"
              }`}
            >
              <SparklesIcon className="h-5 w-5" />
              Rectify Chaos
            </button>
          </div>
        </div>

        {/* ================================================== */}
        {/* Mode Description */}
        {/* ================================================== */}

        <div
          className={`mb-5 rounded-lg border p-4 ${
            isManifest
              ? "border-purple-900 bg-purple-950/30"
              : "border-cyan-900 bg-cyan-950/30"
          }`}
        >
          <h4
            className={`mb-2 font-semibold ${
              isManifest ? "text-purple-400" : "text-cyan-400"
            }`}
          >
            {modeName}
          </h4>

          <p className="text-sm leading-relaxed text-gray-300">
            {isManifest
              ? "Produce violent Chaotic energy to affect saturation and attack mana structures therein."
              : "Cleanse Chaos with Unity to affect saturation and purify mana structures therein."}
          </p>

          <p className="mt-3 text-sm leading-relaxed text-gray-400">
            Saturation operates in a PPP that decreases every turn mana is used.{" "}
            <span className="italic">(See: Battle Mechanics)</span>
          </p>

          {!isManifest && (
            <p className="mt-3 text-sm font-semibold text-yellow-400">
              Note: It is easier to introduce Chaos than to remove it.
            </p>
          )}
        </div>

        {/* ================================================== */}
        {/* Saturation Input */}
        {/* ================================================== */}

        <label className="block">
          <span className="mb-2 block font-semibold text-gray-300">
            Saturation
          </span>

          <input
            type="number"
            min={0}
            step={1}
            value={saturation}
            onChange={(e) =>
              setSaturation(
                Math.max(0, Math.trunc(Number(e.target.value) || 0)),
              )
            }
            className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100 focus:border-cyan-500 focus:outline-none"
          />

          <span className="mt-2 block text-sm text-gray-400">
            Mana cost: {manaPerSaturation} per Saturation point.
          </span>
        </label>
      </div>

      {/* ================================================== */}
      {/* Spell Properties */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        {/* ================================================== */}
        {/* Header / Spell Recovery Button */}
        {/* ================================================== */}

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-gray-700 pb-3">
          <h3 className="text-lg font-semibold text-orange-400">
            Spell Properties
          </h3>

          <button
            type="button"
            aria-pressed={spellRecovery}
            onClick={() => setSpellRecovery((prev) => !prev)}
            className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
              spellRecovery
                ? "bg-purple-700 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-purple-700 hover:text-white"
            }`}
          >
            Spell Recovery
          </button>
        </div>

        {/* ================================================== */}
        {/* Spell Recovery Details */}
        {/* ================================================== */}

        {spellRecovery && (
          <div className="mb-5 rounded-lg border border-purple-700 bg-purple-950/30 p-4 text-sm text-purple-200">
            <p>
              <span className="font-semibold">Spell Recovery:</span> Allows the
              re-casting of lost spells at 50% Manna cost.
            </p>

            <div className="mt-4 space-y-2 rounded-md border border-purple-800 bg-gray-900 p-4">
              <div className="flex justify-between">
                <span>Normal Manna Cost</span>

                <span className="font-semibold text-gray-200">{finalCost}</span>
              </div>

              <div className="flex justify-between">
                <span>Recovery Discount</span>

                <span className="font-semibold text-purple-300">50%</span>
              </div>

              <div className="flex justify-between border-t border-purple-800 pt-3">
                <span className="font-semibold">Recovery Cost</span>

                <span className="font-bold text-purple-300">
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
          {/* ================================================== */}
          {/* Mode */}
          {/* ================================================== */}

          <div className="flex justify-between gap-4">
            <span>Mode</span>

            <span className="text-right font-semibold text-cyan-400">
              {modeName.toUpperCase()}
            </span>
          </div>

          {/* ================================================== */}
          {/* Mastery */}
          {/* ================================================== */}

          <div className="flex justify-between">
            <span>Mastery</span>

            <span className="font-semibold text-cyan-400">{mastery}</span>
          </div>

          {/* ================================================== */}
          {/* Saturation */}
          {/* ================================================== */}

          <div className="flex justify-between">
            <span>Saturation</span>

            <span className="font-semibold text-cyan-400">{saturation}</span>
          </div>

          {/* ================================================== */}
          {/* Range */}
          {/* ================================================== */}

          <div className="flex justify-between">
            <span>Range</span>

            <span className="font-semibold text-cyan-400">RADIAL</span>
          </div>

          {/* ================================================== */}
          {/* Base Cost */}
          {/* ================================================== */}

          <div className="flex justify-between">
            <span>Base Cost</span>

            <span className="font-semibold text-cyan-400">{baseCost}</span>
          </div>

          {/* ================================================== */}
          {/* Mana per Saturation */}
          {/* ================================================== */}

          <div className="flex justify-between">
            <span>Mana per Saturation</span>

            <span className="font-semibold text-cyan-400">
              {manaPerSaturation}
            </span>
          </div>

          {/* ================================================== */}
          {/* Saturation Cost */}
          {/* ================================================== */}

          <div className="flex justify-between">
            <span>Saturation Cost</span>

            <span className="font-semibold text-cyan-400">
              +{saturationCost}
            </span>
          </div>

          {/* ================================================== */}
          {/* Recovery Cost */}
          {/* ================================================== */}

          {spellRecovery && (
            <div className="flex justify-between">
              <span>Spell Recovery Cost</span>

              <span className="font-semibold text-purple-400">
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

export default ManifestChaos;
