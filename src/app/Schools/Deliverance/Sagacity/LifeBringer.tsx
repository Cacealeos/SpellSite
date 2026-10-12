import { useEffect, useState } from "react";
import { HeartIcon } from "@heroicons/react/24/solid";
import { Mastery, Potency, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// Types
// ==================================================

type LifeBringerProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

type ConversionType = "DTL" | "LTD";
type PotencyType = "MINOR" | "MAJOR" | "EXTREME";

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
// Spell Data
// ==================================================

const spellTable = {
  DTL: {
    MINOR: { cost: 40, ratio: 15 },
    MAJOR: { cost: 80, ratio: 10 },
    EXTREME: { cost: 120, ratio: 5 },
  },
  LTD: {
    MINOR: { cost: 20, ratio: 5 },
    MAJOR: { cost: 40, ratio: 10 },
    EXTREME: { cost: 60, ratio: 20 },
  },
};

// ==================================================
// Conversion Options
// ==================================================

const conversionOptions = [
  {
    value: "DTL" as const,
    label: "Durability → Life Force",
    description: "Convert Durability into Life Force.",
  },
  {
    value: "LTD" as const,
    label: "Life Force → Durability",
    description: "Convert Life Force into Durability.",
  },
];

// ==================================================
// Potency Options
// ==================================================

const dtlPotencyOptions = [
  {
    value: "MINOR" as const,
    label: "Minor",
    description: "40 • 15:1",
  },
  {
    value: "MAJOR" as const,
    label: "Major",
    description: "80 • 10:1",
  },
  {
    value: "EXTREME" as const,
    label: "Extreme",
    description: "120 • 5:1",
  },
];

const ltdPotencyOptions = [
  {
    value: "MINOR" as const,
    label: "Minor",
    description: "20 • 1:5",
  },
  {
    value: "MAJOR" as const,
    label: "Major",
    description: "40 • 1:10",
  },
  {
    value: "EXTREME" as const,
    label: "Extreme",
    description: "60 • 1:20",
  },
];

// ==================================================
// Component
// ==================================================

const LifeBringer = ({
  ParentMastery,
  active,
  updateSpell,
}: LifeBringerProps) => {
  // ==================================================
  // State
  // ==================================================

  const [conversion, setConversion] = useState<ConversionType>("DTL");

  const [selectedPotency, setSelectedPotency] = useState<PotencyType>("MINOR");

  const [amount, setAmount] = useState(0);

  // ==================================================
  // Spell Calculations
  // ==================================================

  const { cost, ratio } = spellTable[conversion][selectedPotency];

  const potencyOptions =
    conversion === "DTL" ? dtlPotencyOptions : ltdPotencyOptions;

  const conversionResult =
    conversion === "DTL" ? Math.floor(amount / ratio) : amount * ratio;

  const conversionLabel =
    conversion === "DTL"
      ? "Durability → Life Force"
      : "Life Force → Durability";

  const conversionRatio = conversion === "DTL" ? `${ratio}:1` : `1:${ratio}`;

  // ==================================================
  // Reset Local State
  // ==================================================

  useEffect(() => {
    if (!active) {
      setConversion("DTL");
      setSelectedPotency("MINOR");
      setAmount(0);
    }
  }, [active]);

  // ==================================================
  // Update Parent Spell
  // ==================================================

  useEffect(() => {
    if (!active) {
      updateSpell("cost", 0);
      updateSpell("potency", new Potency());
      return;
    }

    const spellPotency = new Potency();

    switch (selectedPotency) {
      case "MINOR":
        spellPotency.minor();
        break;

      case "MAJOR":
        spellPotency.major();
        break;

      case "EXTREME":
        spellPotency.extreme();
        break;
    }

    updateSpell("cost", cost);
    updateSpell("potency", spellPotency);
  }, [active, conversion, cost, selectedPotency, updateSpell]);

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
        <HeartIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">Life Bringer</h1>
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
        <h2 className="mb-4 border-b border-gray-700 pb-3 text-lg font-semibold text-cyan-400">
          Spell Properties
        </h2>

        {/* ================================================== */}
        {/* Conversion Selection */}
        {/* ================================================== */}

        <div>
          <h3 className="mb-3 text-sm font-semibold text-gray-300">
            Conversion
          </h3>

          <div className="space-y-3">
            {conversionOptions.map((option) => (
              <label
                key={option.value}
                className={`flex cursor-pointer items-center justify-between gap-4 rounded-md border bg-gray-900 px-4 py-3 transition hover:border-orange-500 ${
                  conversion === option.value
                    ? "border-orange-500"
                    : "border-gray-700"
                }`}
              >
                <div>
                  <p className="font-medium text-gray-100">{option.label}</p>

                  <p className="text-sm text-gray-400">{option.description}</p>
                </div>

                <input
                  type="radio"
                  name="life-bringer-conversion"
                  checked={conversion === option.value}
                  onChange={() => setConversion(option.value)}
                  className="h-5 w-5 accent-orange-500"
                />
              </label>
            ))}
          </div>
        </div>

        {/* ================================================== */}
        {/* Potency Selection */}
        {/* ================================================== */}

        <div className="mt-6 border-t border-gray-700 pt-5">
          <PotencySelector
            options={potencyOptions}
            selectedPotency={selectedPotency}
            setSelectedPotency={setSelectedPotency}
          />
        </div>
      </div>

      {/* ================================================== */}
      {/* Conversion Calculator */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h2 className="mb-4 border-b border-gray-700 pb-3 text-lg font-semibold text-cyan-400">
          Conversion Calculator
        </h2>

        {/* ================================================== */}
        {/* Conversion Amount */}
        {/* ================================================== */}

        <label
          htmlFor="life-bringer-amount"
          className="mb-2 block text-sm font-semibold text-gray-300"
        >
          {conversion === "DTL"
            ? "Durability to Convert"
            : "Life Force to Convert"}
        </label>

        <input
          id="life-bringer-amount"
          type="number"
          min={0}
          step={ratio}
          value={amount}
          onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
          className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50"
        />

        {/* ================================================== */}
        {/* Conversion Result */}
        {/* ================================================== */}

        <div className="mt-4 flex justify-between border-t border-gray-700 pt-3">
          <span className="text-gray-300">
            {conversion === "DTL"
              ? "Life Force Generated"
              : "Durability Generated"}
          </span>

          <span className="font-semibold text-orange-400">
            {conversionResult}
          </span>
        </div>

        <p className="mt-3 text-xs text-gray-400">
          This calculator is for player reference only and does not change the
          spell's Manna cost.
        </p>
      </div>

      {/* ================================================== */}
      {/* Final Spell Statistics */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h2 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Final Spell Statistics
        </h2>

        <div className="space-y-3 text-gray-300">
          {/* ================================================== */}
          {/* Conversion Type */}
          {/* ================================================== */}

          <div className="flex justify-between gap-4">
            <span>Conversion</span>

            <span className="text-right font-semibold text-orange-400">
              {conversionLabel}
            </span>
          </div>

          {/* ================================================== */}
          {/* Potency */}
          {/* ================================================== */}

          <div className="flex justify-between">
            <span>Potency</span>

            <span className="font-semibold text-orange-400">
              {selectedPotency}
            </span>
          </div>

          {/* ================================================== */}
          {/* Conversion Ratio */}
          {/* ================================================== */}

          <div className="flex justify-between">
            <span>Conversion Ratio</span>

            <span className="font-semibold text-orange-400">
              {conversionRatio}
            </span>
          </div>

          {/* ================================================== */}
          {/* Manna */}
          {/* ================================================== */}

          <div className="flex justify-between border-t border-gray-700 pt-3">
            <span>Manna</span>

            <span className="font-semibold text-orange-400">{cost}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifeBringer;
