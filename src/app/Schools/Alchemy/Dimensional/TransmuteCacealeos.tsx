import { useEffect, useState } from "react";
import { Mastery, Potency, Spell } from "@/app/models";
import { CubeTransparentIcon } from "@heroicons/react/24/solid";
import PotencySelector from "@/app/PotencyDisplay";
import Select from "@/app/Select";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// Types
// ==================================================

type TransmuteCacealeosProps = {
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

const types = ["Prism", "Law", "Reinforcement", "Junction"];

// ==================================================
// Potency Statistics
// ==================================================

const potencyStats = {
  MINOR: {
    NOVICE: 75,
    INTERMEDIATE: 50,
    MASTERED: 25,
  },
  MAJOR: {
    NOVICE: 150,
    INTERMEDIATE: 100,
    MASTERED: 50,
  },
  EXTREME: {
    NOVICE: 300,
    INTERMEDIATE: 200,
    MASTERED: 100,
  },
};

// ==================================================
// Potency Options
// ==================================================

const potencyOptions = [
  {
    value: "MINOR" as const,
    label: "Minor",
    description: `Cost: ${potencyStats.MINOR.NOVICE} / ${potencyStats.MINOR.INTERMEDIATE} / ${potencyStats.MINOR.MASTERED}`,
  },
  {
    value: "MAJOR" as const,
    label: "Major",
    description: `Cost: ${potencyStats.MAJOR.NOVICE} / ${potencyStats.MAJOR.INTERMEDIATE} / ${potencyStats.MAJOR.MASTERED}`,
  },
  {
    value: "EXTREME" as const,
    label: "Extreme",
    description: `Cost: ${potencyStats.EXTREME.NOVICE} / ${potencyStats.EXTREME.INTERMEDIATE} / ${potencyStats.EXTREME.MASTERED}`,
  },
];

const TransmuteCacealeos = ({
  ParentMastery,
  active,
  updateSpell,
}: TransmuteCacealeosProps) => {
  // ==================================================
  // State
  // ==================================================

  const [type, setType] = useState("Prism");

  const [selectedPotency, setSelectedPotency] = useState<
    "MINOR" | "MAJOR" | "EXTREME"
  >("MINOR");

  const [hyperSpell, setHyperSpell] = useState(false);

  // ==================================================
  // Spell Statistics
  // ==================================================

  const isJunction = type === "Junction";

  const masteryType = ParentMastery.getType() as
    | "NOVICE"
    | "INTERMEDIATE"
    | "MASTERED";

  const finalCost = potencyStats[selectedPotency][masteryType] ?? 0;

  const mannaCost = isJunction ? finalCost : 0;

  // ==================================================
  // Reset Local State
  // ==================================================

  useEffect(() => {
    if (active) return;

    setType("Prism");
    setSelectedPotency("MINOR");
    setHyperSpell(false);
  }, [active]);

  // ==================================================
  // Update Parent Spell
  // ==================================================

  useEffect(() => {
    if (!active) return;

    const pot = new Potency();

    switch (selectedPotency) {
      case "MINOR":
        pot.minor();
        break;

      case "MAJOR":
        pot.major();
        break;

      case "EXTREME":
        pot.extreme();
        break;
    }

    updateSpell("potency", pot);
    updateSpell("cost", mannaCost);

    // Transmute Cacealeos does not intrinsically generate TTT.
    updateSpell("ttt", 0);
  }, [active, selectedPotency, mannaCost, updateSpell]);

  // ==================================================
  // Render
  // ==================================================

  if (!active) return null;

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-gray-200 shadow-lg">
      {/* ================================================== */}
      {/* Spell Title */}
      {/* ================================================== */}

      <div className="flex items-center gap-3">
        <CubeTransparentIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">
          Transmute Cacealeos
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

        {/* ================================================== */}
        {/* Hyper Spell Effect */}
        {/* ================================================== */}

        {hyperSpell && (
          <p className="mb-5 border-b border-gray-700 pb-3 text-sm text-purple-300">
            Functions with{" "}
            <span className="font-semibold">TRANSMUTE REINFORCEMENT</span> to
            make the algorithm dynamic, causing it to change when parsing
            attempts are made and disabling progress over time.
          </p>
        )}

        {/* ================================================== */}
        {/* Type Selection */}
        {/* ================================================== */}

        <div>
          <h3 className="mb-3 text-lg font-bold text-orange-400">
            Cacealeos Type
          </h3>

          <Select title="Type" choices={types} changeChoice={setType} />
        </div>

        {/* ================================================== */}
        {/* Potency Selection */}
        {/* ================================================== */}

        {isJunction && (
          <div className="mt-6 border-t border-gray-700 pt-6">
            <PotencySelector
              options={potencyOptions}
              selectedPotency={selectedPotency}
              setSelectedPotency={setSelectedPotency}
            />
          </div>
        )}
      </div>

      {/* ================================================== */}
      {/* Final Spell Statistics */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Final Spell Statistics
        </h2>

        <div className="space-y-3 text-gray-300">
          <div className="flex justify-between">
            <span>Type</span>
            <span className="font-semibold text-orange-400">{type}</span>
          </div>

          {isJunction && (
            <div className="flex justify-between">
              <span>Potency</span>
              <span className="font-semibold text-orange-400">
                {selectedPotency}
              </span>
            </div>
          )}

          <div className="flex justify-between">
            <span>Range</span>
            <span className="font-semibold text-orange-400">Direct</span>
          </div>

          <div className="flex justify-between border-t border-gray-700 pt-3">
            <span>Manna</span>
            <span className="font-semibold text-orange-400">{mannaCost}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransmuteCacealeos;
