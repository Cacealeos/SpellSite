"use client";

import React, { useState } from "react";

export type SpellTechnique =
  | "Quick Spell"
  | "Spell Reflex"
  | "Double Cast"
  | "Double Pulse"
  | "Carry Spell"
  | "Spell Shift"
  | "Counter Spell"
  | "Spell Surge"
  | "Junction Cast"
  | "Spell Charge"
  | "Focus Spell"
  | "Hyper Spell"
  | "Auto Cast"
  | "Rivet Cast"
  | "Spell Recovery"
  | "Father Spell";

export interface SpellTechniquesTableProps {
  techniques: Record<SpellTechnique, boolean>;
}

const techniqueOrder: readonly SpellTechnique[] = [
  "Quick Spell",
  "Spell Reflex",
  "Double Cast",
  "Double Pulse",
  "Carry Spell",
  "Spell Shift",
  "Counter Spell",
  "Spell Surge",
  "Junction Cast",
  "Spell Charge",
  "Focus Spell",
  "Hyper Spell",
  "Auto Cast",
  "Rivet Cast",
  "Spell Recovery",
  "Father Spell",
] as const;

export default function SpellTechniquesTable({
  techniques,
}: SpellTechniquesTableProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="w-full border-b-4 border-gray-700 pb-6">
      {/* Technique Table Toggle */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="
          w-full
          rounded-md
          border border-gray-700
          bg-gray-800
          px-4 py-3
          text-center
          text-xl font-bold
          text-orange-400
          transition-all duration-200
          hover:border-orange-500
          hover:bg-gray-750
          hover:text-orange-300
        "
      >
        <span>Available Spell Techniques</span>
        <span className="ml-3 text-sm">{isOpen ? "▲" : "▼"}</span>
      </button>

      {/* Animated Technique Table */}
      <div
        className={`
          grid grid-cols-4 gap-2
          overflow-hidden
          transition-all duration-700 ease-in-out
          ${
            isOpen ? "mt-3 max-h-[500px] opacity-100" : "mt-0 max-h-0 opacity-0"
          }
        `}
      >
        {techniqueOrder.map((technique, index) => {
          const enabled = techniques[technique];

          return (
            <div
              key={technique}
              className={`
                rounded-md border px-3 py-2 text-center
                transition-all duration-500 ease-out
                ${
                  isOpen
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-2 opacity-0"
                }
                ${
                  enabled
                    ? "border-orange-500 bg-gray-800 text-orange-300 shadow-[0_0_8px_rgba(249,115,22,0.25)]"
                    : "border-gray-700 bg-gray-900 text-gray-600"
                }
              `}
              style={{
                transitionDelay: isOpen ? `${index * 50}ms` : "0ms",
              }}
            >
              <span className="text-sm font-medium">{technique}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
