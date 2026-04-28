"use client";
import { useState } from "react";

const Select = ({
  choices,
  changeChoice,
  title,
}: {
  choices: string[];
  changeChoice: (choice: string) => void;
  title: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full">
      <button
        onClick={() => setOpen(!open)}
        className="
          flex w-full items-center justify-between
          rounded-xl border border-gray-700 bg-gray-800
          px-4 py-3 text-left text-gray-100
          shadow-lg transition
          hover:bg-gray-700 hover:border-gray-600
          active:scale-[0.99]
        "
      >
        <span>{title}</span>
        <span className={`transition-transform ${open ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-gray-700 bg-gray-800 shadow-2xl max-h-64 overflow-y-auto">
          {choices.map((choice) => (
            <button
              key={choice}
              onClick={() => {
                changeChoice(choice);
                setOpen(false);
              }}
              className="
                block w-full px-4 py-2 text-left text-gray-200
                transition-all duration-150
                hover:bg-gradient-to-r hover:from-cyan-600 hover:to-purple-600
                hover:text-white
                hover:shadow-md
                hover:pl-5
                active:scale-[0.99]
              "
            >
              {choice}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;
