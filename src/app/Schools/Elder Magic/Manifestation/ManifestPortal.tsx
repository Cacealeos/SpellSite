import { useEffect, useState } from "react";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";

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
  "Carry Spell": true,
  "Spell Shift": true,
  "Counter Spell": true,
  "Spell Surge": true,
  "Junction Cast": true,
  "Spell Charge": true,
  "Focus Spell": true,
  "Hyper Spell": true,
  "Auto Cast": true,
  "Rivet Cast": true,
  "Spell Recovery": false,
  "Father Spell": false,
};

// ==================================================
// Constants
// ==================================================

const MASTERY_COSTS = {
  NOVICE: {
    base: 75,
    duration: 8,
  },
  INTERMEDIATE: {
    base: 50,
    duration: 6,
  },
  MASTERED: {
    base: 25,
    duration: 4,
  },
};

const PORTAL_SIZES = {
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

type PortalSize = keyof typeof PORTAL_SIZES;

// ==================================================
// Component
// ==================================================

const ManifestPortal = ({
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

  const [duration, setDuration] = useState(15);

  const [portalSize, setPortalSize] = useState<PortalSize>("SIZEABLE");

  const [hyperSpell, setHyperSpell] = useState(false);

  // ==================================================
  // Mastery
  // ==================================================

  const mastery = ParentMastery.getType() as
    | "NOVICE"
    | "INTERMEDIATE"
    | "MASTERED";

  const masteryStats = MASTERY_COSTS[mastery];

  // ==================================================
  // Portal Size
  // ==================================================

  const selectedSize = PORTAL_SIZES[portalSize];

  // ==================================================
  // Hyper Spell Calculations
  // ==================================================

  const durationMultiplier = hyperSpell ? 1.5 : 1;

  const finalDuration = Math.ceil(duration * durationMultiplier);

  // ==================================================
  // Cost Calculations
  // ==================================================

  const baseCost = masteryStats.base;

  const durationCost = duration * masteryStats.duration;

  const subtotal = baseCost + durationCost;

  const sizeMultiplier = selectedSize.multiplier;

  const finalCost = Math.ceil(subtotal * selectedSize.multiplier);

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
        <ArrowTopRightOnSquareIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">Manifest Portal</h1>
      </div>

      {/* ================================================== */}
      {/* Spell Techniques Table */}
      {/* ================================================== */}

      <div className="mt-6">
        <SpellTechniquesTable techniques={Techniques} />
      </div>

      {/* ================================================== */}
      {/* Portal Configuration */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Portal Configuration
        </h3>

        <p className="mb-5 text-sm italic text-gray-400">
          Average duration of an out-of-combat portal is approximately 15 turns.
          (GMD)
        </p>

        <div className="space-y-5">
          {/* ================================================== */}
          {/* Duration */}
          {/* ================================================== */}

          <label className="block">
            <span className="mb-2 block font-semibold text-gray-300">
              Duration (Turns)
            </span>

            <input
              type="number"
              min={1}
              step={1}
              value={duration}
              onChange={(e) =>
                setDuration(
                  Math.max(1, Math.trunc(Number(e.target.value) || 1)),
                )
              }
              className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100 focus:border-cyan-500 focus:outline-none"
            />
          </label>

          {/* ================================================== */}
          {/* Portal Size */}
          {/* ================================================== */}

          <div>
            <span className="mb-3 block font-semibold text-gray-300">
              Portal Size
            </span>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {(Object.keys(PORTAL_SIZES) as PortalSize[]).map((size) => {
                const option = PORTAL_SIZES[size];

                const selected = portalSize === size;

                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setPortalSize(size)}
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
      {/* Spell Properties */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        {/* ================================================== */}
        {/* Spell Properties Header */}
        {/* ================================================== */}

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-700 pb-3">
          <h3 className="text-lg font-semibold text-cyan-400">
            Spell Properties
          </h3>

          <button
            type="button"
            onClick={() => setHyperSpell(!hyperSpell)}
            aria-pressed={hyperSpell}
            className={`rounded-md px-3 py-1 text-sm font-semibold transition-colors ${
              hyperSpell
                ? "bg-purple-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-purple-600 hover:text-white"
            }`}
          >
            Hyper Spell
          </button>
        </div>

        {/* ================================================== */}
        {/* Hyper Spell Caption */}
        {/* ================================================== */}

        {hyperSpell && (
          <p className="mb-4 text-sm text-purple-400">
            Grants Portals greater resistance to disruption and lasts{" "}
            <strong>50% longer</strong>.
          </p>
        )}

        <div className="space-y-3 text-gray-300">
          {/* ================================================== */}
          {/* Mastery */}
          {/* ================================================== */}

          <div className="flex justify-between">
            <span>Mastery</span>

            <span className="font-semibold text-cyan-400">{mastery}</span>
          </div>

          {/* ================================================== */}
          {/* Base Cost */}
          {/* ================================================== */}

          <div className="flex justify-between">
            <span>Base Cost</span>

            <span className="font-semibold text-cyan-400">{baseCost}</span>
          </div>

          {/* ================================================== */}
          {/* Duration */}
          {/* ================================================== */}

          <div className="flex justify-between">
            <span>Duration</span>

            <div className="flex justify-between">
              <span className="font-semibold text-cyan-400">
                {finalDuration} Turns
              </span>
            </div>
          </div>

          {/* ================================================== */}
          {/* Duration Rate */}
          {/* ================================================== */}

          <div className="flex justify-between">
            <span>Mana per Turn</span>

            <span className="font-semibold text-cyan-400">
              {masteryStats.duration}
            </span>
          </div>

          {/* ================================================== */}
          {/* Duration Cost */}
          {/* ================================================== */}

          <div className="flex justify-between">
            <span>Duration Cost</span>

            <span className="font-semibold text-cyan-400">+{durationCost}</span>
          </div>

          {/* ================================================== */}
          {/* Portal Size */}
          {/* ================================================== */}

          <div className="flex justify-between">
            <span>Portal Size</span>

            <span className="font-semibold text-cyan-400">
              {selectedSize.label}
            </span>
          </div>

          {/* ================================================== */}
          {/* Size Multiplier */}
          {/* ================================================== */}

          <div className="flex justify-between">
            <span>Size Multiplier</span>

            <span className="font-semibold text-cyan-400">
              ×{sizeMultiplier}
            </span>
          </div>

          {/* ================================================== */}
          {/* Subtotal */}
          {/* ================================================== */}

          <div className="flex justify-between border-t border-gray-700 pt-3">
            <span>Subtotal</span>

            <span className="font-semibold text-cyan-400">{subtotal}</span>
          </div>

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

export default ManifestPortal;
