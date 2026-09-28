import { useEffect, useState } from "react";

import { Mastery, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// Static Data
// ==================================================

const potencyData = {
  MINOR: {
    costs: {
      NOVICE: 100,
      INTERMEDIATE: 75,
      MASTERED: 50,
    },
  },
  MAJOR: {
    costs: {
      NOVICE: 200,
      INTERMEDIATE: 150,
      MASTERED: 100,
    },
  },
  EXTREME: {
    costs: {
      NOVICE: 300,
      INTERMEDIATE: 225,
      MASTERED: 150,
    },
  },
};

const potencyOptions = [
  {
    value: "MINOR" as const,
    label: "Minor",
    description: "100 / 75 / 50",
  },
  {
    value: "MAJOR" as const,
    label: "Major",
    description: "200 / 150 / 100",
  },
  {
    value: "EXTREME" as const,
    label: "Extreme",
    description: "300 / 225 / 150",
  },
];

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
  "Focus Spell": false,
  "Hyper Spell": true,
  "Auto Cast": false,
  "Rivet Cast": true,
  "Spell Recovery": false,
  "Father Spell": false,
};

// ==================================================
// Component
// ==================================================

export default function BreakSeal({
  ParentMastery,
  active,
  updateSpell,
}: {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
}) {
  // ==================================================
  // State
  // ==================================================

  const [selectedPotency, setSelectedPotency] = useState<
    "MINOR" | "MAJOR" | "EXTREME"
  >("MINOR");

  const [counterSpell, setCounterSpell] = useState(false);

  // ==================================================
  // Derived Values
  // ==================================================

  const mastery = ParentMastery.getType() as
    | "NOVICE"
    | "INTERMEDIATE"
    | "MASTERED";

  const cost = potencyData[selectedPotency].costs[mastery];

  // ==================================================
  // Spell Updates
  // ==================================================

  useEffect(() => {
    if (!active) {
      updateSpell("cost", 0);
      return;
    }

    updateSpell("cost", cost);
  }, [active, cost, updateSpell]);

  // ==================================================
  // Render
  // ==================================================

  if (!active) return null;

  return (
    <>
      {/* ================================================== */}
      {/* Spell Techniques */}
      {/* ================================================== */}

      <SpellTechniquesTable techniques={Techniques} />

      {/* ================================================== */}
      {/* Statistics */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <div className="mb-3 flex items-center justify-between border-b border-gray-700 pb-2">
          <h3 className="text-lg font-semibold text-orange-400">
            Break Seal Statistics
          </h3>

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
        </div>

        {counterSpell && (
          <p className="text-sm text-gray-400">
            Allows for the interruption of the Sealing process as a{" "}
            <span className="font-semibold text-red-300">DEFENSIVE ACTION</span>
          </p>
        )}
      </div>

      {/* ================================================== */}
      {/* Potency */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Potency
        </h3>

        <PotencySelector
          options={potencyOptions}
          selectedPotency={selectedPotency}
          setSelectedPotency={setSelectedPotency}
        />
      </div>

      {/* ================================================== */}
      {/* Description */}
      {/* ================================================== */}

      <div className="mt-4 text-center text-sm text-gray-400">
        <p>Info: Break Limiter Seal safely.</p>
      </div>
    </>
  );
}
