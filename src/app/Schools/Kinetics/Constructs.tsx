import { useEffect, useState } from "react";
import { Mastery, Potency, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";
import Select from "@/app/Select";

type ConstructsProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

const Constructs = ({
  ParentMastery,
  active,
  updateSpell,
}: ConstructsProps) => {
  const [power, setPower] = useState(0);
  const [damage, setDamage] = useState(0);
  const [size, setSize] = useState("Tiny");

  const [selectedPotency, setSelectedPotency] = useState<
    "MINOR" | "MAJOR" | "EXTREME"
  >("MINOR");

  const potencyOptions = [
    {
      value: "MINOR" as const,
      label: "Minor",
      description: "15 / 10 / 5",
    },
    {
      value: "MAJOR" as const,
      label: "Major",
      description: "45 / 30 / 15",
    },
    {
      value: "EXTREME" as const,
      label: "Extreme",
      description: "135 / 90 / 45",
    },
  ];

  const getMasteryRates = () => {
    switch (ParentMastery.getType()) {
      case "NOVICE":
        return {
          powerRate: 6,
          damageRate: 4,
        };

      case "INTERMEDIATE":
        return {
          powerRate: 4,
          damageRate: 3,
        };

      case "MASTERED":
        return {
          powerRate: 2,
          damageRate: 2,
        };

      default:
        return {
          powerRate: 0,
          damageRate: 0,
        };
    }
  };

  const getBaseCost = () => {
    switch (ParentMastery.getType()) {
      case "NOVICE":
        switch (selectedPotency) {
          case "MINOR":
            return 15;
          case "MAJOR":
            return 45;
          case "EXTREME":
            return 135;
        }
        break;

      case "INTERMEDIATE":
        switch (selectedPotency) {
          case "MINOR":
            return 10;
          case "MAJOR":
            return 30;
          case "EXTREME":
            return 90;
        }
        break;

      case "MASTERED":
        switch (selectedPotency) {
          case "MINOR":
            return 5;
          case "MAJOR":
            return 15;
          case "EXTREME":
            return 45;
        }
        break;
    }

    return 0;
  };

  const getBaseVitality = () => {
    switch (selectedPotency) {
      case "MINOR":
        return 10;

      case "MAJOR":
        return 30;

      case "EXTREME":
        return 90;

      default:
        return 10;
    }
  };

  const getSizeOptions = () => {
    switch (selectedPotency) {
      case "MINOR":
        return ["Tiny", "Sizeable"];

      case "MAJOR":
        return ["Sizeable", "Enormous"];

      case "EXTREME":
        return ["Enormous", "Gargantuan"];

      default:
        return ["Tiny", "Sizeable"];
    }
  };

  const getSizeMultiplier = () => {
    switch (size) {
      case "Tiny":
        return 0.5;

      case "Sizeable":
        return 1;

      case "Enormous":
        return 2;

      case "Gargantuan":
        return 4;

      default:
        return 1;
    }
  };

  const rates = getMasteryRates();
  const baseVitality = getBaseVitality();
  const sizeOptions = getSizeOptions();

  const vitality = baseVitality * getSizeMultiplier();

  // Only Power/Endurance generate TTT.
  const ttt = power * rates.powerRate;

  const cost = getBaseCost() + damage * rates.damageRate;

  useEffect(() => {
    if (!active) {
      setPower(0);
      setDamage(0);
      setSize("Tiny");
      setSelectedPotency("MINOR");
    }
  }, [active]);

  useEffect(() => {
    if (!active) return;

    const validSizes = getSizeOptions();

    if (!validSizes.includes(size)) {
      setSize(validSizes[0]);
    }
  }, [active, selectedPotency, size]);

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
    updateSpell("cost", cost);
    updateSpell("ttt", ttt);
  }, [active, selectedPotency, cost, ttt, updateSpell]);

  if (!active) return null;

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-gray-200 shadow-lg">
      <div>
        <h1 className="text-2xl font-bold text-gray-100">Constructs</h1>

        <div className="mt-2 space-y-1 text-sm text-gray-400">
          <p>POWER & ENDURANCE</p>
          <p>KINETIC DAMAGE</p>
          <p>RANGE - MISSILE / MELEE</p>
        </div>
      </div>

      <div className="mt-6">
        <PotencySelector
          options={potencyOptions}
          selectedPotency={selectedPotency}
          setSelectedPotency={setSelectedPotency}
        />
      </div>

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-4 border-b border-gray-700 pb-2 text-xl font-bold text-orange-400">
          Power & Endurance
        </h2>

        <p className="mb-2 text-sm text-gray-400">Manna to Power & Endurance</p>

        <input
          type="number"
          min="0"
          max="3"
          step="1"
          value={power}
          onChange={(e) => setPower(Math.max(0, Number(e.target.value) || 0))}
          className="w-24 rounded border border-gray-600 bg-gray-900 px-3 py-2 text-center text-lg text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50"
        />

        <p className="mt-2 text-sm text-gray-400">
          {rates.powerRate} TTT per Power/Endurance.
        </p>

        <div className="mt-5">
          <p className="mb-2 text-sm text-gray-400">Size</p>

          <Select title={size} choices={sizeOptions} changeChoice={setSize} />

          <p className="mt-2 text-sm text-gray-400">
            Base Vitality: {baseVitality}
          </p>

          <p className="mt-1 text-sm text-gray-400">
            Vitality is determined by Potency and Size.
          </p>

          <p className="mt-2">
            Vitality:{" "}
            <span className="font-semibold text-cyan-400">{vitality}</span>
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-4 border-b border-gray-700 pb-2 text-xl font-bold text-orange-400">
          Damage
        </h2>

        <p className="mb-2 text-sm text-gray-400">Manna to Damage</p>

        <input
          type="number"
          min="0"
          max={power * 15 + 5}
          step="1"
          value={damage}
          onChange={(e) => setDamage(Math.max(0, Number(e.target.value) || 0))}
          className="w-24 rounded border border-gray-600 bg-gray-900 px-3 py-2 text-center text-lg text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50"
        />

        <p className="mt-2 text-sm text-gray-400">
          {rates.damageRate} Manna per Damage.
        </p>
      </div>

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Final Spell Statistics
        </h2>

        <div className="space-y-2 text-gray-300">
          <div className="flex justify-between">
            <span>Potency</span>
            <span className="font-semibold text-orange-400">
              {selectedPotency}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Size</span>
            <span className="font-semibold text-orange-400">{size}</span>
          </div>

          <div className="flex justify-between">
            <span>Power / Endurance</span>
            <span className="font-semibold text-cyan-400">{power}</span>
          </div>

          <div className="flex justify-between">
            <span>Vitality</span>
            <span className="font-semibold text-cyan-400">{vitality}</span>
          </div>

          <div className="flex justify-between">
            <span>Damage</span>
            <span className="font-semibold text-cyan-400">{damage}</span>
          </div>

          <div className="flex justify-between border-t border-gray-700 pt-2">
            <span>Cost</span>
            <span className="font-semibold text-cyan-400">{cost}</span>
          </div>

          <div className="flex justify-between">
            <span>TTT</span>
            <span className="font-semibold text-orange-400">{ttt}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Constructs;
