import { useEffect, useMemo, useState } from "react";
import { Mastery, Spell } from "@/app/models";

type InscribeSpellSealProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

const InscribeSpellSeal = ({
  ParentMastery,
  active,
  updateSpell,
}: InscribeSpellSealProps) => {
  const [mms, setMms] = useState(0);
  const [spellCost, setSpellCost] = useState(0);
  const [limitedCost, setLimitedCost] = useState(0);
  const [limitedCharge, setLimitedCharge] = useState(0);
  const [limitedUse, setLimitedUse] = useState(0);
  const [limitedCompound, setLimitedCompound] = useState(0);

  const masteryType = ParentMastery.getType();

  /*
   * Mastery determines the MMS penalty from Limited Cost
   * and the MMS increase from Limited Charge.
   */
  const stipulationRates = useMemo(() => {
    switch (masteryType) {
      case "NOVICE":
        return {
          costMmsPenalty: 0.05,
          chargeMmsIncrease: 0.03,
        };

      case "INTERMEDIATE":
        return {
          costMmsPenalty: 0.03,
          chargeMmsIncrease: 0.05,
        };

      case "MASTERED":
        return {
          costMmsPenalty: 0.02,
          chargeMmsIncrease: 0.1,
        };

      default:
        return {
          costMmsPenalty: 0,
          chargeMmsIncrease: 0,
        };
    }
  }, [masteryType]);

  /*
   * Limited Cost
   *
   * Each increment:
   * - Reduces the sealed spell's cost by 5%.
   * - Reduces adjusted MMS by the mastery-specific rate.
   *
   * Both effects are capped at 30%.
   */
  const costReduction = Math.min(limitedCost * 0.05, 0.3);

  const costMmsPenalty = Math.min(
    limitedCost * stipulationRates.costMmsPenalty,
    0.3,
  );

  /*
   * Limited Charge
   *
   * Each increment adds one turn of charge time.
   * Each turn increases adjusted MMS by the mastery-specific rate.
   *
   * MMS increase is capped at 30%.
   */
  const chargeMmsIncrease = Math.min(
    limitedCharge * stipulationRates.chargeMmsIncrease,
    0.3,
  );

  /*
   * Limited Use
   *
   * Starts at +25% MMS and decreases by 5 percentage
   * points for every additional use.
   *
   * 0 uses = +25%
   * 1 use  = +20%
   * 2 uses = +15%
   * 3 uses = +10%
   * 4 uses = +5%
   * 5 uses = +0%
   */
  const useMmsIncrease =
    limitedUse > 0 ? Math.max(0.25 - (limitedUse - 1) * 0.05, 0) : 0;
  /*
   * Limited Compound
   *
   * Each increment reduces adjusted MMS by 10%.
   */
  const compoundMmsReduction = limitedCompound * 0.1;

  /*
   * Final adjusted MMS.
   *
   * Each stipulation modifies the original MMS independently.
   */
  const adjustedMms = Math.trunc(
    mms *
      (1 - costMmsPenalty) *
      (1 + chargeMmsIncrease) *
      (1 + useMmsIncrease) *
      (1 - compoundMmsReduction),
  );

  /*
   * Final spell cost after the Limited Cost reduction.
   */
  const adjustedSpellCost = Math.trunc(spellCost * (1 - costReduction));

  /*
   * Reset the component when it becomes inactive.
   */
  useEffect(() => {
    if (!active) {
      setMms(0);
      setSpellCost(0);
      setLimitedCost(0);
      setLimitedCharge(0);
      setLimitedUse(0);
      setLimitedCompound(0);
    }
  }, [active]);

  /*
   * Push the calculated spell statistics to the parent.
   */
  useEffect(() => {
    if (!active) return;

    updateSpell("cost", adjustedSpellCost);
    updateSpell("ttt", 0);
  }, [active, adjustedSpellCost, updateSpell]);

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-gray-200 shadow-lg">
      {/* Title */}
      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h1 className="text-2xl font-bold text-cyan-400">
          Inscribe Spell Seal
        </h1>

        <p className="mt-2 text-sm text-gray-400">
          Create a seal with selectable stipulations that modify the spell's
          cost, charge time, and maximum caster manna.
        </p>
      </div>

      {/* Maximum Caster Manna */}
      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 text-lg font-bold text-cyan-300">
          Maximum Caster Manna
        </h2>

        <div className="rounded border border-gray-700 bg-gray-900 p-3">
          <p className="mb-2 text-sm text-gray-400">Base MMS</p>

          <input
            type="number"
            min="0"
            max="500"
            step="1"
            value={mms}
            onChange={(e) => setMms(Number(e.target.value) || 0)}
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

          <p className="mt-2 text-sm text-gray-500">Maximum: 500 MMS</p>
        </div>
      </div>

      {/* Sealed Spell */}
      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 text-lg font-bold text-cyan-300">Sealed Spell</h2>

        <div className="rounded border border-gray-700 bg-gray-900 p-3">
          <p className="mb-2 text-sm text-gray-400">Base Spell Cost</p>

          <input
            type="number"
            min="0"
            step="1"
            value={spellCost}
            onChange={(e) => setSpellCost(Number(e.target.value) || 0)}
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

          <p className="mt-2 text-sm text-gray-500">
            Adjusted cost: {adjustedSpellCost}
          </p>
        </div>
      </div>

      {/* Stipulations */}
      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-4 text-lg font-bold text-cyan-300">Stipulations</h2>

        <div className="space-y-4">
          {/* Limited Cost */}
          <div className="rounded border border-gray-700 bg-gray-900 p-4">
            <div className="mb-2">
              <p className="font-semibold text-gray-200">Limited Cost</p>

              <p className="text-sm text-gray-400">
                Reduce spell cost by 5% per increment
              </p>

              <p className="text-sm text-gray-500">
                MMS penalty: -{stipulationRates.costMmsPenalty * 100}% per
                increment
              </p>
            </div>

            <input
              type="number"
              min="0"
              max="6"
              step="1"
              value={limitedCost}
              onChange={(e) => setLimitedCost(Number(e.target.value) || 0)}
              className="
                w-28
                rounded
                border
                border-gray-600
                bg-gray-800
                px-3
                py-2
                text-center
                text-white
                outline-none
                transition
                focus:border-cyan-500
                focus:ring-2
                focus:ring-cyan-500/50
              "
            />

            <p className="mt-2 text-sm text-gray-500">
              Cost reduction: {Math.trunc(costReduction * 100)}%
            </p>

            <p className="text-sm text-gray-500">
              MMS penalty: {Math.trunc(costMmsPenalty * 100)}%
            </p>
          </div>

          {/* Limited Charge */}
          <div className="rounded border border-gray-700 bg-gray-900 p-4">
            <div className="mb-2">
              <p className="font-semibold text-gray-200">Limited Charge</p>

              <p className="text-sm text-gray-400">
                +1 turn of Charge Time per increment
              </p>

              <p className="text-sm text-gray-500">
                MMS increase: +{stipulationRates.chargeMmsIncrease * 100}% per
                turn
              </p>
            </div>

            <input
              type="number"
              min="0"
              max="30"
              step="1"
              value={limitedCharge}
              onChange={(e) => setLimitedCharge(Number(e.target.value) || 0)}
              className="
                w-28
                rounded
                border
                border-gray-600
                bg-gray-800
                px-3
                py-2
                text-center
                text-white
                outline-none
                transition
                focus:border-cyan-500
                focus:ring-2
                focus:ring-cyan-500/50
              "
            />

            <p className="mt-2 text-sm text-gray-500">
              Charge Time: +{limitedCharge} turns
            </p>

            <p className="text-sm text-gray-500">
              MMS increase: +{Math.trunc(chargeMmsIncrease * 100)}%
            </p>
          </div>

          {/* Limited Use */}
          <div className="rounded border border-gray-700 bg-gray-900 p-4">
            <div className="mb-2">
              <p className="font-semibold text-gray-200">Limited Use</p>

              <p className="text-sm text-gray-400">
                MMS increase decreases with additional uses
              </p>
            </div>

            <input
              type="number"
              min="0"
              max="5"
              step="1"
              value={limitedUse}
              onChange={(e) => setLimitedUse(Number(e.target.value) || 0)}
              className="
                w-28
                rounded
                border
                border-gray-600
                bg-gray-800
                px-3
                py-2
                text-center
                text-white
                outline-none
                transition
                focus:border-cyan-500
                focus:ring-2
                focus:ring-cyan-500/50
              "
            />

            <p className="mt-2 text-sm text-gray-500">
              MMS increase: +{Math.trunc(useMmsIncrease * 100)}%
            </p>
          </div>

          {/* Limited Compound */}
          <div className="rounded border border-gray-700 bg-gray-900 p-4">
            <div className="mb-2">
              <p className="font-semibold text-gray-200">Limited Compound</p>

              <p className="text-sm text-gray-400">
                Reduce adjusted MMS by 10% per increment
              </p>
            </div>

            <input
              type="number"
              min="0"
              max="5"
              step="1"
              value={limitedCompound}
              onChange={(e) => setLimitedCompound(Number(e.target.value) || 0)}
              className="
                w-28
                rounded
                border
                border-gray-600
                bg-gray-800
                px-3
                py-2
                text-center
                text-white
                outline-none
                transition
                focus:border-cyan-500
                focus:ring-2
                focus:ring-cyan-500/50
              "
            />

            <p className="mt-2 text-sm text-gray-500">
              MMS reduction: -{Math.trunc(compoundMmsReduction * 100)}%
            </p>
          </div>
        </div>
      </div>

      {/* Spell Statistics */}
      <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 text-lg font-bold text-orange-400">
          Spell Statistics
        </h2>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">Base Maximum Caster Manna</p>

            <p className="text-xl font-bold text-white">{mms}</p>
          </div>

          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">
              Adjusted Maximum Caster Manna
            </p>

            <p className="text-xl font-bold text-white">{adjustedMms}</p>
          </div>

          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">Base Spell Cost</p>

            <p className="text-xl font-bold text-white">{spellCost}</p>
          </div>

          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">Adjusted Spell Cost</p>

            <p className="text-xl font-bold text-white">{adjustedSpellCost}</p>
          </div>

          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">Charge Time</p>

            <p className="text-xl font-bold text-white">{limitedCharge}</p>
          </div>

          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">TTT</p>

            <p className="text-xl font-bold text-white">0</p>
          </div>

          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">Active Stipulations</p>

            <p className="text-xl font-bold text-white">
              {
                [
                  limitedCost > 0,
                  limitedCharge > 0,
                  limitedUse > 0,
                  limitedCompound > 0,
                ].filter(Boolean).length
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InscribeSpellSeal;
