import React, { useMemo, useState } from "react";
import { Mastery } from "../../../models/Mastery";

const InducedIllusion = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [smell, setSmell] = useState(false);
  const [sight, setSight] = useState(false);
  const [touch, setTouch] = useState(false);
  const [sound, setSound] = useState(false);
  const [taste, setTaste] = useState(false);
  const [manna, setManna] = useState(false);
  const [desc, setDesc] = useState("");

  const senses = [
    { label: "Sight", value: sight, setter: setSight },
    { label: "Smell", value: smell, setter: setSmell },
    { label: "Touch", value: touch, setter: setTouch },
    { label: "Taste", value: taste, setter: setTaste },
    { label: "Sound", value: sound, setter: setSound },
    { label: "Manna", value: manna, setter: setManna },
  ];

  const testMastery = new Mastery();

  const tttRate = useMemo(() => {
    if (ParentMastery.getType() === testMastery.novice(true)) return 9;
    if (ParentMastery.getType() === testMastery.intermediate(true)) return 6;
    if (ParentMastery.getType() === testMastery.mastered(true)) return 3;

    return 0;
  }, [ParentMastery]);

  const selectedSenses = [smell, sight, touch, sound, taste, manna].filter(
    Boolean,
  ).length;

  const hasDescription = desc.trim().length > 0;

  const selectedTargets = selectedSenses + (hasDescription ? 1 : 0);

  const totalTTT = selectedTargets * tttRate;

  return (
    <div>
      <h1>Induced Illusion</h1>

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Illusion Properties
        </h3>

        <div className="space-y-3 text-gray-300">
          <p>RANGE - DIRECT</p>

          <div>
            <p className="mb-3">Impair Senses: {tttRate} TTT per sense</p>

            <div className="grid grid-cols-2 gap-3">
              {senses.map(({ label, value, setter }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setter(!value)}
                  className={`relative rounded-lg border px-4 py-3 text-left transition-all duration-200 ${
                    value
                      ? "border-cyan-400 bg-cyan-950/40 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.25)]"
                      : "border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-500 hover:text-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{label}</span>

                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full border text-xs transition-all ${
                        value
                          ? "border-cyan-400 bg-cyan-400 text-gray-900"
                          : "border-gray-600 text-transparent"
                      }`}
                    >
                      ✓
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block">
              Additional Illusion Description
            </label>

            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Optional"
              className="min-h-20 w-full rounded-md border border-gray-600 bg-gray-900 p-2 text-gray-100"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-cyan-400">
          Final Spell Statistics
        </h3>

        <div className="space-y-3 text-gray-300">
          <div className="flex justify-between">
            <span>Selected Senses</span>
            <span className="font-semibold text-cyan-400">
              {selectedSenses}
            </span>
          </div>

          <div className="flex justify-between">
            <span>TTT per Sense</span>
            <span className="font-semibold text-cyan-400">{tttRate}</span>
          </div>

          <div className="flex justify-between">
            <span>Total TTT</span>
            <span className="font-semibold text-cyan-400">{totalTTT}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InducedIllusion;
