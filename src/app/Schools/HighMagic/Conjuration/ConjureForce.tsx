import { useEffect, useState } from "react";
import { Mastery, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";
import { force } from "./ConjurationData";

const ConjureForce = ({
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

  const [selectedMedium, setSelectedMedium] =
    useState<keyof typeof force>("Gas");

  const medium = force[selectedMedium];

  const potencyOptions = [
    {
      value: "MINOR" as const,
      label: "Minor",
      description: "20 / 10 / 1",
    },
    {
      value: "MAJOR" as const,
      label: "Major",
      description: "30 / 20 / 10",
    },
    {
      value: "EXTREME" as const,
      label: "Extreme",
      description: "40 / 30 / 20",
    },
  ];

  let cost = 0;

  switch (ParentMastery.getType()) {
    case "NOVICE":
      switch (selectedPotency) {
        case "MINOR":
          cost = 20;
          break;
        case "MAJOR":
          cost = 30;
          break;
        case "EXTREME":
          cost = 40;
          break;
      }
      break;

    case "INTERMEDIATE":
      switch (selectedPotency) {
        case "MINOR":
          cost = 10;
          break;
        case "MAJOR":
          cost = 20;
          break;
        case "EXTREME":
          cost = 30;
          break;
      }
      break;

    case "MASTERED":
      switch (selectedPotency) {
        case "MINOR":
          cost = 1;
          break;
        case "MAJOR":
          cost = 10;
          break;
        case "EXTREME":
          cost = 20;
          break;
      }
      break;
  }

  const colorStyles = {
    green: {
      border: "border-green-400",
      text: "text-green-400",
      glow: "shadow-[0_0_12px_rgba(74,222,128,0.5)]",
    },
    red: {
      border: "border-red-400",
      text: "text-red-400",
      glow: "shadow-[0_0_12px_rgba(248,113,113,0.5)]",
    },
    blue: {
      border: "border-blue-400",
      text: "text-blue-400",
      glow: "shadow-[0_0_12px_rgba(96,165,250,0.5)]",
    },
    purple: {
      border: "border-purple-400",
      text: "text-purple-400",
      glow: "shadow-[0_0_12px_rgba(192,132,252,0.5)]",
    },
  };

  useEffect(() => {
    if (!active) {
      updateSpell("cost", 0);
    }
  }, [active, updateSpell]);

  useEffect(() => {
    if (!active) {
      updateSpell("cost", 0);
      return;
    }

    updateSpell("cost", cost);
  }, [active, cost, updateSpell]);

  return (
    <div>
      <div>
        <h2 className="text-xl font-bold text-orange-400">Conjure Force</h2>

        <div className="mt-1 mb-4 h-px bg-gray-600" />

        <h3 className="text-lg font-semibold text-orange-400">Medium</h3>

        <div className="grid grid-cols-4 gap-3">
          {Object.entries(force).map(([name, data]) => {
            const Icon = data.Icon;
            const selected = selectedMedium === name;

            const styles = colorStyles[data.color];

            return (
              <button
                key={name}
                onClick={() => setSelectedMedium(name as keyof typeof force)}
                className={`
        flex flex-col items-center justify-center
        rounded-lg border p-3
        transition-all
        ${selected ? `${styles.border} ${styles.glow}` : "border-gray-600"}
      `}
              >
                <Icon
                  className={`
          h-8 w-8
          ${selected ? styles.text : "text-gray-400"}
        `}
                />

                <span
                  className={`
          mt-2 text-sm
          ${selected ? styles.text : "text-gray-300"}
        `}
                >
                  {name}
                </span>
              </button>
            );
          })}
        </div>

        <br />

        <PotencySelector
          options={potencyOptions}
          selectedPotency={selectedPotency}
          setSelectedPotency={setSelectedPotency}
        />

        <br />

        <p className="text-sm text-gray-400">
          Potency scales with Power, Cost, and Area of Effect.
        </p>

        <div className="mt-5 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-md">
          <h3 className="text-lg font-semibold text-orange-400">
            {selectedMedium}
          </h3>

          <div className="mt-2 h-px bg-gray-700" />

          <div className="mt-3 space-y-2 text-sm text-gray-300">
            <p>
              <span className="font-semibold text-gray-400">Damage:</span>{" "}
              {medium.Damage}
            </p>

            <p>
              <span className="font-semibold text-gray-400">Range:</span>{" "}
              {medium.Range}
            </p>
          </div>
        </div>
        <br />
        <p className="text-sm text-gray-400">
          Targets the environment to either push, pull, shape, or shake matter.
          Environmental damage can be inflicted indirectly in this way.
        </p>
      </div>
    </div>
  );
};

export default ConjureForce;

{
  /* <p className="mt-2">
            Targets the environment to either push, pull, shape, or shake
            matter. Environmental damage can be inflicted indirectly in this
            way.
          </p> */
}
