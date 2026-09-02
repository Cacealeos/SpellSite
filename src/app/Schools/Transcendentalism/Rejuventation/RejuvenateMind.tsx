import { useEffect, useState } from "react";
import { Mastery, Spell } from "@/app/models";

type RejuvenateMindProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

const RejuvenateMind = ({
  ParentMastery,
  active,
  updateSpell,
}: RejuvenateMindProps) => {
  const [variant, setVariant] = useState("");

  const cost = 100;

  const variants = ["Expel", "Relent", "Assemble"];

  useEffect(() => {
    if (!active) {
      setVariant("");
      return;
    }

    updateSpell("cost", cost);
    updateSpell("ttt", 0);
  }, [active, updateSpell]);

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-gray-200 shadow-lg">
      {/* Title */}
      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h1 className="text-2xl font-bold text-cyan-400">Rejuvenate Mind</h1>
      </div>

      {/* Variant Selection */}
      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-4 text-lg font-bold text-cyan-300">Variant</h2>

        <div className="space-y-3">
          {variants.map((item) => (
            <label
              key={item}
              className={`
                flex cursor-pointer items-center justify-between
                rounded border p-3 transition
                ${
                  variant === item
                    ? "border-cyan-500 bg-gray-900"
                    : "border-gray-700 bg-gray-900 hover:border-gray-500"
                }
              `}
            >
              <span className="font-semibold text-gray-200">{item}</span>

              <input
                type="radio"
                name="mind-variant"
                value={item}
                checked={variant === item}
                onChange={() => setVariant(item)}
                className="h-5 w-5 accent-cyan-500"
              />
            </label>
          ))}
        </div>

        <p className="mt-4 text-sm text-gray-400">Select one mind variant.</p>
      </div>

      {/* Spell Statistics */}
      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 text-lg font-bold text-orange-400">
          Spell Statistics
        </h2>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">Cost</p>
            <p className="text-xl font-bold text-white">{cost}</p>
          </div>

          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">Variant</p>
            <p className="text-xl font-bold text-white">{variant || "None"}</p>
          </div>

          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">Potency</p>
            <p className="text-xl font-bold text-white">None</p>
          </div>

          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">TTT</p>
            <p className="text-xl font-bold text-white">0</p>
          </div>
        </div>
      </div>

      {/* Secondary */}
      <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 text-lg font-bold text-orange-400">Secondary</h2>

        <div className="rounded border border-gray-700 bg-gray-900 p-3">
          <p className="text-sm font-semibold text-gray-300">MIND</p>
          <p className="text-sm text-gray-400">
            {variant || "No variant selected"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RejuvenateMind;
