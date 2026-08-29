import React, { useEffect, useState } from "react";
import { Mastery } from "../../../models/Mastery";
import { Spell } from "../../../models/Spell";

const ProjectedIllusion = ({
  ParentMastery,
  active,
  updateSpell,
}: {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
}) => {
  const [smell, setSmell] = useState(false);
  const [sight, setSight] = useState(false);
  const [touch, setTouch] = useState(false);
  const [sound, setSound] = useState(false);
  const [taste, setTaste] = useState(false);
  const [manna, setManna] = useState(false);
  const [desc, setDesc] = useState("");

  // Small AOE is selected by default.
  const [size, setSize] = useState(1);

  let testMastery: Mastery = new Mastery();

  /*
   * Determine the TTT cost for each individual impaired sense
   * based on the current mastery.
   */
  let senseCost = 0;

  if (ParentMastery.getType() === testMastery.novice(true)) {
    senseCost = 15;
  }

  if (ParentMastery.getType() === testMastery.intermediate(true)) {
    senseCost = 10;
  }

  if (ParentMastery.getType() === testMastery.mastered(true)) {
    senseCost = 5;
  }

  /*
   * Determine the AOE TTT cost.
   *
   * Small:
   *   Novice 5 / Intermediate 3 / Mastered 1
   *
   * Moderate:
   *   Novice 9 / Intermediate 6 / Mastered 3
   *
   * Large:
   *   Novice 15 / Intermediate 11 / Mastered 7
   */
  let aoeCost = 0;

  if (ParentMastery.getType() === testMastery.novice(true)) {
    if (size === 1) aoeCost = 5;
    if (size === 2) aoeCost = 9;
    if (size === 3) aoeCost = 15;
  }

  if (ParentMastery.getType() === testMastery.intermediate(true)) {
    if (size === 1) aoeCost = 3;
    if (size === 2) aoeCost = 6;
    if (size === 3) aoeCost = 11;
  }

  if (ParentMastery.getType() === testMastery.mastered(true)) {
    if (size === 1) aoeCost = 1;
    if (size === 2) aoeCost = 3;
    if (size === 3) aoeCost = 7;
  }

  /*
   * Every selected sense contributes the full sense cost.
   *
   * For example, at Novice:
   *
   * Sight             = 15
   * Sight + Sound     = 30
   * Sight + Sound +
   * Touch             = 45
   *
   * The AOE cost is then added independently.
   */
  const impairedSenseCount = [sight, smell, touch, taste, sound, manna].filter(
    Boolean,
  ).length;

  const TTT = impairedSenseCount * senseCost + aoeCost;

  /*
   * Keep the parent Spell's TTT synchronized with this component.
   *
   * When the spell is inactive, reset its TTT to 0.
   */
  useEffect(() => {
    if (!active) {
      updateSpell("ttt", 0);
      return;
    }

    updateSpell("ttt", TTT);
  }, [active, TTT, updateSpell]);

  return (
    <div className="space-y-6">
      {/* ==================================================
          Spell Properties
          ================================================== */}

      <div className="rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h2 className="mb-3 border-b border-gray-700 pb-2 text-xl font-semibold text-cyan-400">
          Projected Illusion
        </h2>

        <div className="space-y-2 text-gray-300">
          <p>RANGE - DIRECT</p>
        </div>
      </div>

      {/* ==================================================
          Sense Selection
          ================================================== */}

      <div className="rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Impair Senses
        </h3>

        <p className="mb-4 text-sm text-gray-400">
          Each selected sense adds {senseCost} TTT.
        </p>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            ["Sight", sight, setSight],
            ["Smell", smell, setSmell],
            ["Touch", touch, setTouch],
            ["Taste", taste, setTaste],
            ["Sound", sound, setSound],
            ["Manna", manna, setManna],
          ].map(([label, selected, setter]) => (
            <button
              key={label as string}
              type="button"
              onClick={() =>
                (setter as React.Dispatch<React.SetStateAction<boolean>>)(
                  !selected,
                )
              }
              className={`rounded-lg border px-4 py-3 text-sm font-semibold transition ${
                selected
                  ? "border-cyan-400 bg-cyan-950 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.25)]"
                  : "border-gray-600 bg-gray-900 text-gray-400 hover:border-gray-400 hover:text-gray-200"
              }`}
            >
              {label as string}
            </button>
          ))}
        </div>
      </div>

      {/* ==================================================
          AOE Selection
          ================================================== */}

      <div className="rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Area of Effect
        </h3>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setSize(1)}
            className={`w-full rounded-lg border p-3 text-left transition ${
              size === 1
                ? "border-cyan-400 bg-cyan-950 text-cyan-300"
                : "border-gray-600 bg-gray-900 text-gray-400 hover:border-gray-400"
            }`}
          >
            <div className="font-semibold">Small AOE</div>
            <div className="text-sm">+5 / 3 / 1 TTT</div>
          </button>

          <button
            type="button"
            onClick={() => setSize(2)}
            className={`w-full rounded-lg border p-3 text-left transition ${
              size === 2
                ? "border-cyan-400 bg-cyan-950 text-cyan-300"
                : "border-gray-600 bg-gray-900 text-gray-400 hover:border-gray-400"
            }`}
          >
            <div className="font-semibold">Moderate AOE</div>
            <div className="text-sm">+9 / 6 / 3 TTT</div>
          </button>

          <button
            type="button"
            onClick={() => setSize(3)}
            className={`w-full rounded-lg border p-3 text-left transition ${
              size === 3
                ? "border-cyan-400 bg-cyan-950 text-cyan-300"
                : "border-gray-600 bg-gray-900 text-gray-400 hover:border-gray-400"
            }`}
          >
            <div className="font-semibold">Large AOE</div>
            <div className="text-sm">+15 / 11 / 7 TTT</div>
          </button>
        </div>
      </div>

      {/* ==================================================
          Description
          ================================================== */}

      <div className="rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Illusion Description
        </h3>

        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="min-h-24 w-full rounded-lg border border-gray-600 bg-gray-900 p-3 text-gray-200 outline-none transition focus:border-cyan-400"
          placeholder="Describe the projected illusion..."
        />
      </div>

      {/* ==================================================
          Final Spell Statistics
          ================================================== */}

      <div className="rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-cyan-400">
          Final Spell Statistics
        </h3>

        <div className="space-y-3 text-gray-300">
          <div className="flex justify-between">
            <span>Impaired Senses</span>
            <span className="font-semibold text-cyan-400">
              {impairedSenseCount}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Sense TTT</span>
            <span className="font-semibold text-cyan-400">
              {impairedSenseCount * senseCost}
            </span>
          </div>

          <div className="flex justify-between">
            <span>AOE</span>
            <span className="font-semibold text-cyan-400">
              {size === 1 ? "Small" : size === 2 ? "Moderate" : "Large"}
            </span>
          </div>

          <div className="flex justify-between">
            <span>AOE TTT</span>
            <span className="font-semibold text-cyan-400">{aoeCost}</span>
          </div>

          <div className="flex justify-between border-t border-gray-700 pt-3">
            <span>Final TTT</span>
            <span className="font-semibold text-cyan-400">{TTT}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectedIllusion;
