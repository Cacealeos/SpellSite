import { useState } from "react";

type DynamicValueEntriesProps = {
  title: string;
  values: number[];
  setValues: React.Dispatch<React.SetStateAction<number[]>>;
};

export default function DynamicValueEntries({
  title,
  values,
  setValues,
}: DynamicValueEntriesProps) {
  const addEntry = () => {
    setValues((current) => [...current, 0]);
  };

  const removeEntry = (index: number) => {
    setValues((current) =>
      current.filter((_, entryIndex) => entryIndex !== index),
    );
  };

  const updateEntry = (index: number, value: number) => {
    setValues((current) =>
      current.map((entry, entryIndex) =>
        entryIndex === index ? value : entry,
      ),
    );
  };

  const total = values.reduce((sum, value) => sum + value, 0);

  return (
    <section className="rounded-lg border border-gray-700 bg-gray-800/60 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-300">
          {title} Entries
        </h2>

        <button
          type="button"
          onClick={addEntry}
          className="rounded-md border border-gray-600 bg-gray-900 px-3 py-1.5 text-sm text-gray-200 transition hover:border-gray-500 hover:bg-gray-700"
        >
          + Add {title}
        </button>
      </div>

      {values.length === 0 ? (
        <p className="text-sm text-gray-500">
          Add each {title.toLowerCase()} and enter its TTT.
        </p>
      ) : (
        <div className="space-y-3">
          {values.map((value, index) => (
            <div key={index} className="flex items-end gap-3">
              <div className="flex-1">
                <label className="mb-1 block text-xs text-gray-500">
                  {title} {index + 1} TTT
                </label>

                <input
                  type="number"
                  min={0}
                  step={1}
                  value={value}
                  onChange={(e) => updateEntry(index, Number(e.target.value))}
                  className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 outline-none transition focus:border-blue-500"
                />
              </div>

              <button
                type="button"
                onClick={() => removeEntry(index)}
                className="rounded-md border border-gray-700 px-3 py-2 text-sm text-gray-400 transition hover:border-red-800 hover:text-red-400"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 border-t border-gray-700 pt-3">
        <p className="text-sm text-gray-400">
          Cumulative TTT:{" "}
          <span className="font-medium text-gray-200">{total}</span>
        </p>
      </div>
    </section>
  );
}
