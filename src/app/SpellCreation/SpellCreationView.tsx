import { useState } from "react";
import { Action, Potency, Mastery } from "../models";

// Global settings passed down
type GlobalConfig = {
  mastery: typeof Mastery;
  potency: typeof Potency;
};

const SCHOOLS = ["Fire", "Water", "Earth", "Air", "Void"];

// School-specific view component
function SchoolView({
  school,
  spell,
  update,
  config,
}: {
  school: string;
  spell: any;
  update: (field: string, value: any) => void;
  config: GlobalConfig;
}) {
  const { mastery, potency } = config;

  return (
    <div className="grid gap-4 p-6 rounded-2xl shadow bg-white">
      <h2 className="text-xl font-semibold">{school} Spell Settings</h2>

      <div className="grid grid-cols-2 gap-4">
        <label className="grid gap-1">
          <span>Base Power</span>
          <input
            type="number"
            value={spell.base}
            onChange={(e) => update("base", Number(e.target.value))}
            className="border p-2 rounded"
          />
        </label>

        <label className="grid gap-1">
          <span>Cost</span>
          <input
            type="number"
            value={spell.cost}
            onChange={(e) => update("cost", Number(e.target.value))}
            className="border p-2 rounded"
          />
        </label>

        <label className="grid gap-1">
          <span>Requirement</span>
          <input
            type="number"
            value={spell.requirement}
            onChange={(e) => update("requirement", Number(e.target.value))}
            className="border p-2 rounded"
          />
        </label>

        <label className="grid gap-1">
          <span>Branch</span>
          <input
            type="text"
            value={spell.branch}
            onChange={(e) => update("branch", e.target.value)}
            className="border p-2 rounded"
          />
        </label>

        <label className="grid gap-1">
          <span>Root</span>
          <input
            type="text"
            value={spell.root}
            onChange={(e) => update("root", e.target.value)}
            className="border p-2 rounded"
          />
        </label>
      </div>

      {/* Enum-driven controls from global config */}
      <div className="grid grid-cols-3 gap-4">
        <label className="grid gap-1">
          <span>Action</span>
          <select
            value={spell.action}
            onChange={(e) => update("action", e.target.value as Action)}
            className="border p-2 rounded"
          >
            {Object.values(Action).map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1">
          <span>Potency</span>
          <select
            value={spell.potency}
            onChange={(e) => update("potency", Number(e.target.value))}
            className="border p-2 rounded"
          >
            {Object.values(potency)
              .filter((v) => typeof v === "number")
              .map((p) => (
                <option key={p} value={p}>
                  {potency[p]}
                </option>
              ))}
          </select>
        </label>

        <label className="grid gap-1">
          <span>Mastery</span>
          <select
            value={spell.mastery}
            onChange={(e) => update("mastery", Number(e.target.value))}
            className="border p-2 rounded"
          >
            {Object.values(mastery)
              .filter((v) => typeof v === "number")
              .map((m) => (
                <option key={m} value={m}>
                  {mastery[m]}
                </option>
              ))}
          </select>
        </label>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={spell.demon}
            onChange={(e) => update("demon", e.target.checked)}
          />
          Demon
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={spell.compound}
            onChange={(e) => update("compound", e.target.checked)}
          />
          Compound
        </label>
      </div>
    </div>
  );
}

export default function SpellCreatorPage() {
  const [school, setSchool] = useState<string>("Fire");

  const emptySpell = {
    base: 0,
    cost: 0,
    requirement: 0,
    branch: "none",
    root: "none",
    action: Action.Main,
    potency: Potency.None,
    mastery: Mastery.Novice,
    demon: false,
    compound: false,
  };

  const [spell, setSpell] = useState(emptySpell);

  const resetSpell = (newSchool: string) => {
    setSchool(newSchool);
    setSpell({ ...emptySpell });
  };

  const update = (field: string, value: any) => {
    setSpell((prev) => ({ ...prev, [field]: value }));
  };

  const globalConfig: GlobalConfig = {
    mastery: Mastery,
    potency: Potency,
  };

  return (
    <div className="p-6 grid gap-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">Spell Creator</h1>

      <div className="flex gap-4">
        {SCHOOLS.map((s) => (
          <button
            key={s}
            className={`px-4 py-2 rounded-2xl shadow ${
              school === s ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => resetSpell(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <SchoolView
        school={school}
        spell={spell}
        update={update}
        config={globalConfig}
      />

      <div className="p-4 rounded-2xl bg-gray-100 shadow">
        <pre className="whitespace-pre-wrap text-sm">
          {JSON.stringify({ school, ...spell }, null, 2)}
        </pre>
      </div>
    </div>
  );
}
