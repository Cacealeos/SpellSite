"use client"
import { useState } from "react";
import * as SpellsClass from "../models"; // Spell, Action, Potency, Mastery
import * as Schools from "../Schools"; // single import for all schools
import Select from "../Select";

type GlobalConfig = {
  mastery: typeof SpellsClass.Mastery;
  potency: typeof SpellsClass.Potency;
  action: typeof SpellsClass.Action;
};

export default function SpellCreatorPage() {
  // Available schools (keys of Schools object)
  const schoolNames = Object.keys(Schools);

  // State for selections
  const [school, setSchool] = useState<string>(schoolNames[0] || "");
  const [branch, setBranch] = useState<string>("");
  const [spellName, setSpellName] = useState<string>("");

  // Parent spell state
  const [spell, setSpell] = useState<SpellsClass.Spell>(
    new SpellsClass.Spell()
  );

  // Global config
  const globalConfig: GlobalConfig = {
    mastery: SpellsClass.Mastery,
    potency: SpellsClass.Potency,
    action: SpellsClass.Action,
  };

  // Get selected school object
  const selectedSchool = school
    ? Schools[school as keyof typeof Schools]
    : null;

  // Branches of selected school
  const branches = selectedSchool ? Object.keys(selectedSchool) : [];

  // Ensure branch is set
  if (!branch && branches.length > 0) setBranch(branches[0]);

  // Spells in selected branch
  const spellsInBranch = branch
    ? Object.keys((selectedSchool as any)[branch])
    : [];

  // Ensure spellName is set
  if (!spellName && spellsInBranch.length > 0) setSpellName(spellsInBranch[0]);

  // Selected spell component
  const SpellComponent =
    branch && spellName && selectedSchool
      ? (selectedSchool as any)[branch][spellName]
      : null;

  // Update spell state
  const updateSpell = (field: string, value: any) => {
    setSpell((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 grid gap-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">Spell Creator</h1>

      {/* School Selector */}
      <Select
        title={school}
        choices={schoolNames}
        changeChoice={(s) => {
          setSchool(s);
          setBranch(""); // reset branch
          setSpellName(""); // reset spell
        }}
      />

      {/* Branch Selector */}
      <Select
        title={branch}
        choices={branches}
        changeChoice={(b) => {
          setBranch(b);
          setSpellName(""); // reset spell when branch changes
        }}
      />

      {/* Spell Selector */}
      <Select
        title={spellName}
        choices={spellsInBranch}
        changeChoice={(s) => setSpellName(s)}
      />

      {/* Render spell component */}
      <div className="mt-4">
        {SpellComponent ? (
          <SpellComponent
            spell={spell}
            config={globalConfig}
            onChange={updateSpell}
          />
        ) : (
          <div>No spell selected</div>
        )}
      </div>

      {/* Output */}
      <div className="p-4 rounded bg-gray-100 shadow mt-6">
        <pre>
          {JSON.stringify({ ...spell, school, branch, spellName }, null, 2)}
        </pre>
      </div>
    </div>
  );
}
