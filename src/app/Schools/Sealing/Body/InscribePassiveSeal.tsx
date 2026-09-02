import { useEffect, useState } from "react";
import { Mastery, Spell } from "@/app/models";
import CustomRadio from "@/app/Radio";

type PassiveTier = "BASIC" | "ADVANCED" | "FORBIDDEN";

type InscribePassiveProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

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

const InscribePassive = ({
  ParentMastery,
  active,
  updateSpell,
}: InscribePassiveProps) => {
  const [techCheck, setTechCheck] = useState(0);
  const [selectedTier, setSelectedTier] = useState<PassiveTier>("BASIC");
  const [ttt, setTtt] = useState(0);
  const [passiveEffects, setPassiveEffects] = useState("");

  /*
   * A tier is selectable only when the Tech Check
   * meets its requirement.
   */
  const isTierAvailable = (requirement: number) => techCheck >= requirement;

  /*
   * Reset the spell-specific state when the spell
   * becomes inactive.
   */
  useEffect(() => {
    if (!active) {
      setTechCheck(0);
      setSelectedTier("BASIC");
      setTtt(0);
      setPassiveEffects("");
    }
  }, [active]);

  /*
   * If the Tech Check is reduced below the currently
   * selected tier's requirement, automatically fall
   * back to the highest tier that remains available.
   */
  useEffect(() => {
    const selectedOption = tierOptions.find(
      (option) => option.value === selectedTier,
    );

    if (!selectedOption || techCheck < selectedOption.requirement) {
      const availableOptions = tierOptions.filter(
        (option) => techCheck >= option.requirement,
      );

      const highestAvailable = availableOptions[availableOptions.length - 1];

      setSelectedTier(highestAvailable?.value ?? "BASIC");
    }
  }, [techCheck, selectedTier]);

  /*
   * Push TTT to the parent while active.
   */
  useEffect(() => {
    if (!active) return;

    updateSpell("ttt", ttt);
  }, [active, ttt, updateSpell]);

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-gray-200 shadow-lg">
      {/* Title */}
      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h1 className="text-2xl font-bold text-cyan-400">
          Inscribe Passive Seal
        </h1>

        <p className="mt-2 text-sm text-gray-400">
          Create a passive seal with a selectable power tier.
        </p>
      </div>

      {/* Tech Check */}
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
            onChange={(e) => setTechCheck(Number(e.target.value) || 0)}
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

      {/* Potency / Tier */}
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

      {/* Passive Effects */}
      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-4 text-lg font-bold text-cyan-300">
          Passive Effects
        </h2>

        <div className="mb-4 rounded border border-gray-700 bg-gray-900 p-3">
          <p className="mb-2 text-sm text-gray-400">TTT</p>

          <input
            type="number"
            min="0"
            step="1"
            value={ttt}
            onChange={(e) => setTtt(Number(e.target.value) || 0)}
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

      {/* Spell Statistics */}
      <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 text-lg font-bold text-orange-400">
          Spell Statistics
        </h2>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">Tech Check</p>

            <p className="text-xl font-bold text-white">{techCheck}</p>
          </div>

          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">Seal Tier</p>

            <p className="text-xl font-bold text-white">
              {
                tierOptions.find((option) => option.value === selectedTier)
                  ?.label
              }
            </p>
          </div>

          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">TTT</p>

            <p className="text-xl font-bold text-white">{ttt}</p>
          </div>

          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">Tier Requirement</p>

            <p className="text-xl font-bold text-white">
              {
                tierOptions.find((option) => option.value === selectedTier)
                  ?.requirement
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InscribePassive;
