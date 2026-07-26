import { useEffect, useState } from "react";

import { Mastery, Spell, Potency } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";

const GatherResonance = ({
  ParentMastery,
  active,
  updateSpell,
}: {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
}) => {
  const [selectedPotency, setSelectedPotency] = useState<
    "MINOR" | "MAJOR" | "EXTREME"
  >("MINOR");

  const [detectLifeForce, setDetectLifeForce] = useState(false);
  const [detectNecroForce, setDetectNecroForce] = useState(false);
  const [detectChaos, setDetectChaos] = useState(false);

  const potencyOptions = [
    {
      value: "MINOR" as const,
      label: "Minor",
      description: "20 / 10 / 0",
    },
    {
      value: "MAJOR" as const,
      label: "Major",
      description: "50 / 40 / 30",
    },
    {
      value: "EXTREME" as const,
      label: "Extreme",
      description: "100 / 80 / 60",
    },
  ];

  useEffect(() => {
    if (!active) {
      updateSpell("cost", 0);
      return;
    }

    const mastery = ParentMastery.getType();

    const costs = {
      MINOR: {
        NOVICE: 20,
        INTERMEDIATE: 10,
        MASTERED: 0,
      },
      MAJOR: {
        NOVICE: 50,
        INTERMEDIATE: 40,
        MASTERED: 30,
      },
      EXTREME: {
        NOVICE: 100,
        INTERMEDIATE: 80,
        MASTERED: 60,
      },
    };

    let cost =
      costs[selectedPotency][mastery as "NOVICE" | "INTERMEDIATE" | "MASTERED"];

    let multiplier = 1;

    if (detectLifeForce) multiplier += 0.5;
    if (detectNecroForce) multiplier += 0.5;
    if (detectChaos) multiplier += 1;

    cost = Math.round(cost * multiplier);

    updateSpell("cost", cost);

    const potency = new Potency();

    switch (selectedPotency) {
      case "MINOR":
        potency.minor();
        break;
      case "MAJOR":
        potency.major();
        break;
      case "EXTREME":
        potency.extreme();
        break;
    }

    updateSpell("potency", potency);
  }, [
    active,
    ParentMastery,
    selectedPotency,
    detectLifeForce,
    detectNecroForce,
    detectChaos,
    updateSpell,
  ]);

  return (
    <>
      <PotencySelector
        options={potencyOptions}
        selectedPotency={selectedPotency}
        setSelectedPotency={setSelectedPotency}
      />

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Detection Options
        </h3>

        <div className="space-y-3">
          <label className="flex cursor-pointer items-center justify-between rounded-md border border-gray-700 bg-gray-900 px-4 py-3 transition hover:border-orange-500">
            <div>
              <p className="font-medium text-gray-100">Detect Life-Force</p>
              <p className="text-sm text-gray-400">Increases Cost by 50%</p>
            </div>

            <input
              type="checkbox"
              checked={detectLifeForce}
              onChange={() => setDetectLifeForce(!detectLifeForce)}
              className="h-5 w-5 accent-orange-500"
            />
          </label>

          <label className="flex cursor-pointer items-center justify-between rounded-md border border-gray-700 bg-gray-900 px-4 py-3 transition hover:border-orange-500">
            <div>
              <p className="font-medium text-gray-100">Detect Necro-Force</p>
              <p className="text-sm text-gray-400">Increases Cost by 50%</p>
            </div>

            <input
              type="checkbox"
              checked={detectNecroForce}
              onChange={() => setDetectNecroForce(!detectNecroForce)}
              className="h-5 w-5 accent-orange-500"
            />
          </label>

          <label className="flex cursor-pointer items-center justify-between rounded-md border border-gray-700 bg-gray-900 px-4 py-3 transition hover:border-orange-500">
            <div>
              <p className="font-medium text-gray-100">Detect Chaotic Energy</p>
              <p className="text-sm text-gray-400">Increases Cost by 100%</p>
            </div>

            <input
              type="checkbox"
              checked={detectChaos}
              onChange={() => setDetectChaos(!detectChaos)}
              className="h-5 w-5 accent-orange-500"
            />
          </label>
        </div>
      </div>

      <div className="mt-8 space-y-4 text-gray-300">
        <p>
          Parse out any latent manna signature in the area being broadcast as
          High Magic or transmitted through Magi-Tech.
        </p>

        <p>
          Can be used pre-emptively or after sensing a manna signature.
          Isolating the source depends on signal strength, integrity, and an
          Intelligence Check.
        </p>

        <p>
          Higher potency improves parsing ability, precision in locating the
          source, and distinguishing multiple signatures through interference.
          Intelligence Checks are used to decipher scrambled signatures.
        </p>
      </div>
    </>
  );
};

export default GatherResonance;
