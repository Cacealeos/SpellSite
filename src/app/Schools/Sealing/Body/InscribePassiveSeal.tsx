import { useEffect, useState } from "react";
import { Spell } from "@/app/models";
import CustomRadio from "@/app/Radio";

// ==================================================
// Types
// ==================================================

type PassiveTier = "BASIC" | "ADVANCED" | "FORBIDDEN";

type InscribePassiveProps = {
  ParentMastery: Spell["mastery"];
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

// ==================================================
// Tier Options
// ==================================================

const tierOptions = [
  {
    value: "BASIC" as PassiveTier,
    label: "Basic",
    requirement: 35,
  },
  {
    value: "ADVANCED" as PassiveTier,
    label: "Advanced",
    requirement: 70,
  },
  {
    value: "FORBIDDEN" as PassiveTier,
    label: "Forbidden",
    requirement: 105,
  },
];

const InscribePassive = ({ active, updateSpell }: InscribePassiveProps) => {
  // ==================================================
  // State
  // ==================================================

  const [techCheck, setTechCheck] = useState(0);
  const [selectedTier, setSelectedTier] = useState<PassiveTier>("BASIC");
  const [ttt, setTtt] = useState(0);
  const [passiveEffects, setPassiveEffects] = useState("");

  const [hyperSpell, setHyperSpell] = useState(false);
  const [counterSpell, setCounterSpell] = useState(false);

  // ==================================================
  // Tier Availability
  // ==================================================

  const isTierAvailable = (requirement: number) => techCheck >= requirement;

  const selectedOption = tierOptions.find(
    (option) => option.value === selectedTier,
  );

  // ==================================================
  // Reset Local State
  // ==================================================

  useEffect(() => {
    if (active) return;

    setTechCheck(0);
    setSelectedTier("BASIC");
    setTtt(0);
    setPassiveEffects("");

    setHyperSpell(false);
    setCounterSpell(false);
  }, [active]);

  // ==================================================
  // Validate Selected Tier
  // ==================================================

  useEffect(() => {
    if (selectedOption && techCheck >= selectedOption.requirement) {
      return;
    }

    const availableOptions = tierOptions.filter(
      (option) => techCheck >= option.requirement,
    );

    const highestAvailable = availableOptions[availableOptions.length - 1];

    const nextTier = highestAvailable?.value ?? "BASIC";

    if (selectedTier !== nextTier) {
      setSelectedTier(nextTier);
    }
  }, [techCheck, selectedTier, selectedOption]);

  // ==================================================
  // Update Parent Spell
  // ==================================================

  useEffect(() => {
    if (!active) return;

    updateSpell("ttt", ttt);
  }, [active, ttt, updateSpell]);

  // ==================================================
  // Render
  // ==================================================

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-gray-200 shadow-lg">
      {/* ================================================== */}
      {/* Spell Title */}
      {/* ================================================== */}

      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h1 className="text-2xl font-bold text-cyan-400">
          Inscribe Passive Seal
        </h1>

        <p className="mt-2 text-sm text-gray-400">
          Create a passive seal with a selectable power tier.
        </p>
      </div>

      {/* ================================================== */}
      {/* Technical Check */}
      {/* ================================================== */}

      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 text-lg font-bold text-cyan-300">
          Technical Check
        </h2>

        <div className="rounded border border-gray-700 bg-gray-900 p-3">
          <p className="mb-2 text-sm text-gray-400">Tech Check</p>

          <input
            type="number"
            min="0"
            step="1"
            value={techCheck}
            onChange={(e) =>
              setTechCheck(Math.max(0, Math.floor(Number(e.target.value) || 0)))
            }
            className="
              w-28
              rounded
              border
              border-gray-600
              bg-gray-800
              px-3
              py-2
              text-center
              text-lg
              text-white
              outline-none
              transition
              focus:border-cyan-500
              focus:ring-2
              focus:ring-cyan-500/50
            "
          />
        </div>
      </div>

      {/* ================================================== */}
      {/* Seal Tier */}
      {/* ================================================== */}

      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-4 text-lg font-bold text-cyan-300">Seal Tier</h2>

        <div className="space-y-3">
          {tierOptions.map((option) => {
            const available = isTierAvailable(option.requirement);

            return (
              <div
                key={option.value}
                className={`
                  rounded border p-3 transition
                  ${
                    available
                      ? "border-gray-700 bg-gray-900"
                      : "border-gray-800 bg-gray-950 opacity-40"
                  }
                `}
              >
                <CustomRadio
                  name="passive-tier"
                  value={option.value}
                  checked={selectedTier === option.value}
                  onChange={() => available && setSelectedTier(option.value)}
                  disabled={!available}
                  label={option.label}
                />

                <p className="mt-1 ml-7 text-sm text-gray-500">
                  Requires Tech Check {option.requirement}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================================================== */}
      {/* Passive Effects */}
      {/* ================================================== */}

      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-4 text-lg font-bold text-cyan-300">
          Passive Effects
        </h2>

        {/* TTT */}

        <div className="mb-4 rounded border border-gray-700 bg-gray-900 p-3">
          <p className="mb-2 text-sm text-gray-400">TTT</p>

          <input
            type="number"
            min="0"
            step="1"
            value={ttt}
            onChange={(e) =>
              setTtt(Math.max(0, Math.floor(Number(e.target.value) || 0)))
            }
            className="
              w-28
              rounded
              border
              border-gray-600
              bg-gray-800
              px-3
              py-2
              text-center
              text-lg
              text-white
              outline-none
              transition
              focus:border-cyan-500
              focus:ring-2
              focus:ring-cyan-500/50
            "
          />
        </div>

        {/* Passive Effects Description */}

        <div className="rounded border border-gray-700 bg-gray-900 p-3">
          <p className="mb-2 text-sm text-gray-400">Passive Effects</p>

          <textarea
            value={passiveEffects}
            onChange={(e) => setPassiveEffects(e.target.value)}
            rows={4}
            className="
              w-full
              resize-none
              rounded
              border
              border-gray-600
              bg-gray-800
              px-3
              py-2
              text-white
              outline-none
              transition
              focus:border-cyan-500
              focus:ring-2
              focus:ring-cyan-500/50
            "
            placeholder="Describe the passive effects..."
          />
        </div>
      </div>

      {/* ================================================== */}
      {/* Spell Statistics */}
      {/* ================================================== */}

      <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-orange-400">
            Spell Statistics
          </h2>

          {/* Technique Toggles */}

          <div className="flex flex-wrap gap-2">
            {/* Hyper Spell */}

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
          {hyperSpell && (
            <p className="border-t border-gray-700 pt-3 text-sm text-purple-300">
              Increases the{" "}
              <span className="font-semibold">MAX MANNA SUPPLY (MMS)</span> of
              the inscribed Body Seal by{" "}
              <span className="font-semibold">15%</span>.
            </p>
          )}

          {counterSpell && (
            <p className="border-t border-gray-700 pt-3 text-sm text-red-300">
              Body Seal activation may be used as a{" "}
              <span className="font-semibold">DEFENSIVE MEASURE</span> if the
              inscribed spell is also compatible with{" "}
              <span className="font-semibold">COUNTER SPELL</span>.
            </p>
          )}
        </div>

        {/* ================================================== */}
        {/* Statistics */}
        {/* ================================================== */}

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">Tech Check</p>

            <p className="text-xl font-bold text-white">{techCheck}</p>
          </div>

          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">Seal Tier</p>

            <p className="text-xl font-bold text-white">
              {selectedOption?.label}
            </p>
          </div>

          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">TTT</p>

            <p className="text-xl font-bold text-white">{ttt}</p>
          </div>

          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">Tier Requirement</p>

            <p className="text-xl font-bold text-white">
              {selectedOption?.requirement}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InscribePassive;
