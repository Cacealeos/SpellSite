import { useEffect, useMemo, useState } from "react";
import { Mastery, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";

type Potency = "MINOR" | "MAJOR" | "EXTREME";

type ImprisionObjectProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

const ImprisionObject = ({
  ParentMastery,
  active,
  updateSpell,
}: ImprisionObjectProps) => {
  const [selectedPotency, setSelectedPotency] = useState<Potency>("MINOR");
  const [ppp, setPpp] = useState(0);

  const masteryType = ParentMastery.getType();

  /*
   * TTT required for each point of PPP.
   */
  const tttRate = useMemo(() => {
    switch (masteryType) {
      case "NOVICE":
        return 5;

      case "INTERMEDIATE":
        return 3;

      case "MASTERED":
        return 1;

      default:
        return 0;
    }
  }, [masteryType]);

  /*
   * Potency cost varies by mastery.
   */
  const potencyCost = useMemo(() => {
    switch (masteryType) {
      case "NOVICE":
        switch (selectedPotency) {
          case "MINOR":
            return 30;
          case "MAJOR":
            return 60;
          case "EXTREME":
            return 120;
        }
        break;

      case "INTERMEDIATE":
        switch (selectedPotency) {
          case "MINOR":
            return 25;
          case "MAJOR":
            return 50;
          case "EXTREME":
            return 100;
        }
        break;

      case "MASTERED":
        switch (selectedPotency) {
          case "MINOR":
            return 20;
          case "MAJOR":
            return 40;
          case "EXTREME":
            return 80;
        }
        break;
    }

    return 0;
  }, [masteryType, selectedPotency]);

  /*
   * Potency provides a Res Check bonus:
   * Minor   +1
   * Major   +2
   * Extreme +3
   */
  const resCheckBonus = useMemo(() => {
    switch (selectedPotency) {
      case "MINOR":
        return 1;

      case "MAJOR":
        return 2;

      case "EXTREME":
        return 3;

      default:
        return 0;
    }
  }, [selectedPotency]);

  /*
   * TTT transferred into PPP.
   */
  const tttToPpp = ppp * tttRate;

  /*
   * Update parent spell statistics while active.
   */
  useEffect(() => {
    if (!active) return;

    updateSpell("cost", potencyCost);
    updateSpell("ttt", tttToPpp);
  }, [active, potencyCost, tttToPpp, updateSpell]);

  /*
   * Reset spell-specific state when inactive.
   */
  useEffect(() => {
    if (!active) {
      setSelectedPotency("MINOR");
      setPpp(0);
    }
  }, [active]);

  const potencyOptions = [
    {
      value: "MINOR" as Potency,
      label: "Minor",
      description: `Cost: ${potencyCost} • +1 Res Check`,
    },
    {
      value: "MAJOR" as Potency,
      label: "Major",
      description: `Cost: ${potencyCost} • +2 Res Check`,
    },
    {
      value: "EXTREME" as Potency,
      label: "Extreme",
      description: `Cost: ${potencyCost} • +3 Res Check`,
    },
  ];

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-gray-200 shadow-lg">
      {/* Title */}
      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h1 className="text-2xl font-bold text-cyan-400">Imprison Object</h1>

        <p className="mt-2 text-sm text-gray-400">
          Transfer TTT into PPP to imprison an object.
        </p>
      </div>

      {/* PPP */}
      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 text-lg font-bold text-cyan-300">TTT to PPP</h2>

        <div className="rounded border border-gray-700 bg-gray-900 p-3">
          <p className="mb-2 text-sm text-gray-400">PPP</p>

          <input
            type="number"
            min="0"
            max="13"
            step="1"
            value={ppp}
            onChange={(e) => setPpp(Number(e.target.value) || 0)}
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
            Rate: {tttRate} TTT per PPP
          </p>

          <p className="text-sm text-gray-500">TTT transferred: {tttToPpp}</p>
        </div>
      </div>

      {/* Potency */}
      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <PotencySelector
          options={potencyOptions}
          selectedPotency={selectedPotency}
          setSelectedPotency={setSelectedPotency}
        />
      </div>

      {/* Res Check */}
      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 text-lg font-bold text-cyan-300">Res Check</h2>

        <div className="rounded border border-gray-700 bg-gray-900 p-3">
          <p className="text-sm text-gray-400">Potency Bonus</p>

          <p className="text-xl font-bold text-white">+{resCheckBonus}</p>
        </div>
      </div>

      {/* Spell Statistics */}
      <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 text-lg font-bold text-orange-400">
          Spell Statistics
        </h2>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">Cost</p>

            <p className="text-xl font-bold text-white">{potencyCost}</p>
          </div>

          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">TTT</p>

            <p className="text-xl font-bold text-white">{tttToPpp}</p>
          </div>

          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">PPP</p>

            <p className="text-xl font-bold text-white">{ppp}</p>
          </div>

          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">Res Check Bonus</p>

            <p className="text-xl font-bold text-white">+{resCheckBonus}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImprisionObject;
