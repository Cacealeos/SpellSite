import { useState } from "react";

import { Mastery } from "@/app/models";

type ReceptorLimiterProps = {
  ParentMastery: Mastery;
  active: boolean;
};

type ReceptorType = "HANDS" | "HEAD" | "BODY";

export default function ReceptorLimiter({
  ParentMastery,
  active,
}: ReceptorLimiterProps) {
  const [receptor, setReceptor] = useState<ReceptorType>("HANDS");
  const [description, setDescription] = useState("");

  if (!active) return null;

  const receptorOptions = [
    {
      value: "HANDS" as const,
      label: "Hands",
    },
    {
      value: "HEAD" as const,
      label: "Head",
    },
    {
      value: "BODY" as const,
      label: "Body",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-gray-100">Receptor Limiter</h1>

      {/* Receptor */}
      <section className="rounded-lg border border-gray-700 bg-gray-800/60 p-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-300">
          Receptor
        </h2>

        <div className="space-y-2">
          {receptorOptions.map((option) => (
            <label
              key={option.value}
              className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 transition ${
                receptor === option.value
                  ? "border-blue-500 bg-gray-700"
                  : "border-gray-700 bg-gray-900 hover:border-gray-600"
              }`}
            >
              <input
                type="radio"
                name="receptor-limiter"
                value={option.value}
                checked={receptor === option.value}
                onChange={() => setReceptor(option.value)}
                className="h-4 w-4"
              />

              <span className="font-medium text-gray-100">{option.label}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Description */}
      <section className="rounded-lg border border-gray-700 bg-gray-800/60 p-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-300">
          Receptor Description
        </h2>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the receptor limitation..."
          rows={5}
          className="w-full resize-y rounded-md border border-gray-700 bg-gray-900 p-3 text-sm text-gray-100 placeholder-gray-500 outline-none transition focus:border-blue-500"
        />
      </section>
    </div>
  );
}
