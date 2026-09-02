import { useState } from "react";

import { Mastery } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";

type IllusionSealProps = {
  ParentMastery: Mastery;
  active: boolean;
};

type PotencyType = "MINOR" | "MAJOR" | "EXTREME";

export default function IllusionSeal({
  ParentMastery,
  active,
}: IllusionSealProps) {
  const [potency, setPotency] = useState<PotencyType>("MINOR");
  const [description, setDescription] = useState("");

  if (!active) return null;

  const potencyOptions = [
    {
      value: "MINOR" as const,
      label: "Minor",
      description: "Res Check: +8",
    },
    {
      value: "MAJOR" as const,
      label: "Major",
      description: "Res Check: +10",
    },
    {
      value: "EXTREME" as const,
      label: "Extreme",
      description: "Res Check: +12",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-gray-100">Illusion Seal</h1>

      {/* Potency */}
      <section className="rounded-lg border border-gray-700 bg-gray-800/60 p-4">
        <PotencySelector
          options={potencyOptions}
          selectedPotency={potency}
          setSelectedPotency={setPotency}
        />

        <div className="mt-4 rounded-md border border-gray-700 bg-gray-900/60 px-3 py-2">
          <p className="text-sm text-gray-400">
            <span className="font-medium text-gray-300">
              Training Required:
            </span>{" "}
            Ghosting
          </p>
        </div>
      </section>

      {/* Illusion Description */}
      <section className="rounded-lg border border-gray-700 bg-gray-800/60 p-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-300">
          Illusion Description
        </h2>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the illusion..."
          rows={5}
          className="w-full resize-y rounded-md border border-gray-700 bg-gray-900 p-3 text-sm text-gray-100 placeholder-gray-500 outline-none transition focus:border-blue-500"
        />
      </section>
    </div>
  );
}
