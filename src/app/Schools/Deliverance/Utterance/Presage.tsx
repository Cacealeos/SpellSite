import { useEffect, useState } from "react";
import { EyeIcon } from "@heroicons/react/24/solid";

import { Mastery, Potency, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// Spell Techniques
// ==================================================

const Techniques = {
  "Quick Spell": true,
  "Spell Reflex": false,
  "Double Cast": true,
  "Double Pulse": true,
  "Soul Cast": false,
  "Full Cast": false,
  "Counter Spell": true,
  "Spell Surge": true,
  "Junction Cast": true,
  "Spell Charge": true,
  "Focus Spell": true,
  "Hyper Spell": true,
  "Auto Cast": false,
  "Rivet Cast": true,
  "Spell Recovery": false,
  "Aura Surge": false,
};

// ==================================================
// Component
// ==================================================

const Presage = ({
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

  const [selectedPotency, setSelectedPotency] = useState<
    "MINOR" | "MAJOR" | "EXTREME"
  >("MINOR");

  const [fullCast, setFullCast] = useState(false);

  // ==================================================
  // Potency Options
  // ==================================================

  const potencyOptions = [
    {
      value: "MINOR" as const,
      label: "Minor",
      description: "40 / 30 / 20",
    },
    {
      value: "MAJOR" as const,
      label: "Major",
      description: "80 / 60 / 40",
    },
    {
      value: "EXTREME" as const,
      label: "Extreme",
      description: "120 / 90 / 60",
    },
  ];

  // ==================================================
  // Deliverance Aspect
  // ==================================================

  const deliveranceAspect =
    selectedPotency === "MINOR"
      ? "Immemorial"
      : selectedPotency === "MAJOR"
        ? "Sagacity"
        : "Ire";

  // ==================================================
  // Reset Full Cast
  // ==================================================

  useEffect(() => {
    if (!active) {
      setFullCast(false);
    }
  }, [active]);

  // ==================================================
  // Spell Calculation
  // ==================================================

  useEffect(() => {
    if (!active) {
      updateSpell("cost", 0);
      return;
    }

    const spellPotency = new Potency();

    let cost = 0;

    switch (selectedPotency) {
      case "MINOR":
        spellPotency.minor();

        switch (ParentMastery.getType()) {
          case "NOVICE":
            cost = 40;
            break;
          case "INTERMEDIATE":
            cost = 30;
            break;
          case "MASTERED":
            cost = 20;
            break;
        }
        break;

      case "MAJOR":
        spellPotency.major();

        switch (ParentMastery.getType()) {
          case "NOVICE":
            cost = 80;
            break;
          case "INTERMEDIATE":
            cost = 60;
            break;
          case "MASTERED":
            cost = 40;
            break;
        }
        break;

      case "EXTREME":
        spellPotency.extreme();

        switch (ParentMastery.getType()) {
          case "NOVICE":
            cost = 120;
            break;
          case "INTERMEDIATE":
            cost = 90;
            break;
          case "MASTERED":
            cost = 60;
            break;
        }
        break;
    }

    updateSpell("cost", cost);
    updateSpell("potency", spellPotency);
  }, [active, ParentMastery, selectedPotency, updateSpell]);

  // ==================================================
  // Render
  // ==================================================

  return (
    <>
      {/* ================================================== */}
      {/* Spell Title */}
      {/* ================================================== */}

      <div className="flex items-center gap-3">
        <EyeIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">Presage</h1>
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
        {/* Spell Properties Header / Technique Toggle */}
        {/* ================================================== */}

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-orange-400">
            Spell Properties
          </h2>

          <button
            type="button"
            aria-pressed={fullCast}
            onClick={() => setFullCast((prev) => !prev)}
            className={`rounded-lg border px-4 py-3 text-sm font-semibold transition-colors ${
              fullCast
                ? "border-purple-400 bg-purple-700 text-white shadow-md shadow-purple-900/30"
                : "border-gray-600 bg-gray-900 text-gray-300 hover:border-purple-500 hover:text-purple-300"
            }`}
          >
            Full Cast
          </button>
        </div>

        {/* ================================================== */}
        {/* Full Cast Description */}
        {/* ================================================== */}

        {fullCast && (
          <div className="mb-5 rounded-lg border border-purple-700 bg-purple-950/30 p-4 text-sm text-purple-200">
            <p>
              <span className="font-semibold">Full Cast:</span> Once per turn,
              Presage grants the caster an additional{" "}
              <span className="font-bold text-purple-100">MAIN ACTION</span>.
            </p>
          </div>
        )}

        {/* ================================================== */}
        {/* Potency Selection */}
        {/* ================================================== */}

        <PotencySelector
          options={potencyOptions}
          selectedPotency={selectedPotency}
          setSelectedPotency={setSelectedPotency}
        />

        {/* ================================================== */}
        {/* Deliverance Aspect */}
        {/* ================================================== */}

        <div className="mt-5 rounded-lg border border-gray-700 bg-gray-900 p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="font-semibold text-orange-400">
              Deliverance Aspect
            </span>

            <span className="font-semibold text-cyan-400">
              {deliveranceAspect}
            </span>
          </div>

          <p className="mt-2 text-xs text-gray-400">
            Selected Potency corresponds to the displayed Deliverance Aspect.
          </p>
        </div>
      </div>
    </>
  );
};

export default Presage;
