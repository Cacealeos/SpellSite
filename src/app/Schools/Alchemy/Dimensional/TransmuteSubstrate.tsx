import { useEffect, useState } from "react";
import { Mastery, Potency, Spell } from "@/app/models";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/solid";
import PotencySelector from "@/app/PotencyDisplay";
import Select from "@/app/Select";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// Types
// ==================================================

type TransmuteSubstrateProps = {
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

const types = ["Displacement", "Warp", "Obfuscation"];

// ==================================================
// Potency Costs
// ==================================================

const potencyCosts = {
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

const TransmuteSubstrate = ({
  ParentMastery,
  active,
  updateSpell,
}: TransmuteSubstrateProps) => {
  // ==================================================
  // State
  // ==================================================

  const [type, setType] = useState("Displacement");

  const [selectedPotency, setSelectedPotency] = useState<
    "MINOR" | "MAJOR" | "EXTREME"
  >("MINOR");

  const [spellCharge, setSpellCharge] = useState(false);
  const [counterSpell, setCounterSpell] = useState(false);

  // ==================================================
  // Potency Options
  // ==================================================

  const potencyOptions = [
    {
      value: "MINOR" as const,
      label: "Minor",
      description: "75 / 50 / 25",
    },
    {
      value: "MAJOR" as const,
      label: "Major",
      description: `150 / 100 / 50${type === "Obfuscation" ? " × 2" : ""}`,
    },
    {
      value: "EXTREME" as const,
      label: "Extreme",
      description: `300 / 200 / 100${type === "Obfuscation" ? " × 4" : ""}`,
    },
  ];

  // ==================================================
  // Spell Statistics
  // ==================================================

  const masteryType = ParentMastery.getType();

  const baseCost =
    masteryType === "NOVICE" ||
    masteryType === "INTERMEDIATE" ||
    masteryType === "MASTERED"
      ? potencyCosts[selectedPotency][masteryType]
      : 0;

  const obfuscationMultiplier =
    type !== "Obfuscation"
      ? 1
      : selectedPotency === "MAJOR"
        ? 2
        : selectedPotency === "EXTREME"
          ? 4
          : 1;

  const finalCost =
    type === "Displacement" ? 0 : baseCost * obfuscationMultiplier;

  // ==================================================
  // Reset Local State
  // ==================================================

  useEffect(() => {
    if (active) return;

    setType("Displacement");
    setSelectedPotency("MINOR");

    setSpellCharge(false);
    setCounterSpell(false);
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

    updateSpell("cost", finalCost);
    updateSpell("ttt", 0);

    // Displacement does not use potency.
    if (type === "Displacement") {
      updateSpell("potency", new Potency());
    } else {
      updateSpell("potency", pot);
    }
  }, [active, type, selectedPotency, finalCost, updateSpell]);

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
        <ArrowsRightLeftIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">
          Transmute Substrate
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

          <div className="flex flex-wrap gap-2">
            {/* Spell Charge */}

            <button
              type="button"
              onClick={() => setSpellCharge((prev) => !prev)}
              className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition ${
                spellCharge
                  ? "border-yellow-400 bg-yellow-500/10 text-yellow-300 shadow-[0_0_12px_rgba(250,204,21,0.5)]"
                  : "border-gray-600 bg-gray-900 text-gray-400 hover:border-yellow-500 hover:text-yellow-300"
              }`}
            >
              Spell Charge
            </button>

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
        </div>

        {/* ================================================== */}
        {/* Technique Effects */}
        {/* ================================================== */}

        <div className="space-y-3">
          {spellCharge && (
            <p className="border-b border-gray-700 pb-3 text-sm text-yellow-300">
              Functions with{" "}
              <span className="font-semibold">TRANSMUTE DISPLACEMENT</span> to
              allow the spell to be carried into combat if started outside of
              combat.
            </p>
          )}

          {counterSpell && (
            <p className="border-b border-gray-700 pb-3 text-sm text-red-300">
              Functions with{" "}
              <span className="font-semibold">TRANSMUTE OBFUSCATION</span>.
            </p>
          )}
        </div>

        {/* ================================================== */}
        {/* Type Selection */}
        {/* ================================================== */}

        <div className="mt-5">
          <h3 className="mb-3 text-lg font-bold text-orange-400">
            Substrate Type
          </h3>

          <Select title={type} choices={types} changeChoice={setType} />
        </div>

        {/* ================================================== */}
        {/* Potency Selection */}
        {/* ================================================== */}

        {type !== "Displacement" && (
          <div className="mt-6 border-t border-gray-700 pt-6">
            <PotencySelector
              options={potencyOptions}
              selectedPotency={selectedPotency}
              setSelectedPotency={setSelectedPotency}
            />
          </div>
        )}

        {/* ================================================== */}
        {/* Obfuscation Cost Information */}
        {/* ================================================== */}

        {type === "Obfuscation" && (
          <p className="mt-3 text-sm text-gray-400">
            Obfuscation increases Major Potency to 2× cost and Extreme Potency
            to 4× cost.
          </p>
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

          {type !== "Displacement" && (
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
            <span className="font-semibold text-orange-400">{finalCost}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransmuteSubstrate;
