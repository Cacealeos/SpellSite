import React, { useEffect, useState } from "react";
import { Mastery, Potency, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

const InveighEthereal = ({
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

  const [spellRecovery, setSpellRecovery] = useState(false);

  // ==================================================
  // Potency Options
  // ==================================================

  const potencyOptions = [
    {
      value: "MINOR" as const,
      label: "Minor",
      description: "40",
    },
    {
      value: "MAJOR" as const,
      label: "Major",
      description: "60",
    },
    {
      value: "EXTREME" as const,
      label: "Extreme",
      description: "80",
    },
  ];

  // ==================================================
  // Spell Techniques
  // ==================================================

  const Techniques = {
    "Quick Spell": true,
    "Spell Reflex": false,
    "Double Cast": true,
    "Double Pulse": true,
    "Counter Spell": false,
    "Full Cast": false,
    "Soul Cast": false,
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
  // Spell Cost
  // ==================================================

  const cost =
    selectedPotency === "MINOR" ? 40 : selectedPotency === "MAJOR" ? 60 : 80;

  // ==================================================
  // Spell Recovery Calculation
  // ==================================================

  const recoveryCost = Math.ceil(cost * 0.75);

  // ==================================================
  // Reset Spell Recovery
  // ==================================================

  useEffect(() => {
    if (!active) {
      setSpellRecovery(false);
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
        cost = 40;
        break;

      case "MAJOR":
        spellPotency.major();
        cost = 60;
        break;

      case "EXTREME":
        spellPotency.extreme();
        cost = 80;
        break;
    }

    updateSpell("cost", cost);
    updateSpell("potency", spellPotency);
  }, [active, selectedPotency, updateSpell]);

  // ==================================================
  // UI
  // ==================================================

  return (
    <>
      {/* ================================================== */}
      {/* Spell Title */}
      {/* ================================================== */}

      <h2 className="mb-6 text-center text-3xl font-bold text-cyan-400">
        Inveigh Ethereal
      </h2>

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
        {/* Spell Properties Header / Technique Toggle */}

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-orange-400">
            Spell Properties
          </h3>

          <button
            type="button"
            aria-pressed={spellRecovery}
            onClick={() => setSpellRecovery((prev) => !prev)}
            className={`rounded-lg border px-4 py-3 text-sm font-semibold transition-colors ${
              spellRecovery
                ? "border-purple-400 bg-purple-700 text-white shadow-md shadow-purple-900/30"
                : "border-gray-600 bg-gray-900 text-gray-300 hover:border-purple-500 hover:text-purple-300"
            }`}
          >
            Spell Recovery
          </button>
        </div>

        {/* ================================================== */}
        {/* Spell Recovery Description */}
        {/* ================================================== */}

        {spellRecovery && (
          <div className="mb-5 rounded-lg border border-purple-700 bg-purple-950/30 p-4 text-sm text-purple-200">
            <p>
              <span className="font-semibold">Spell Recovery:</span> Interrupted
              Immemorial spells may be re-cast for 75% of their normal Manna
              cost.
            </p>

            <p className="mt-2 text-xs text-purple-300">
              Recovery Cost:{" "}
              <span className="font-semibold text-purple-200">
                {recoveryCost} Manna
              </span>
            </p>
          </div>
        )}

        {/* ================================================== */}
        {/* Spell Information */}
        {/* ================================================== */}

        <div className="text-gray-300"></div>
      </div>

      {/* ================================================== */}
      {/* Potency */}
      {/* ================================================== */}

      <div className="mt-6">
        <PotencySelector
          options={potencyOptions}
          selectedPotency={selectedPotency}
          setSelectedPotency={setSelectedPotency}
        />
      </div>
    </>
  );
};

export default InveighEthereal;
