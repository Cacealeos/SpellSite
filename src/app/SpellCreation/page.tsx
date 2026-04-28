"use client";
import React from "react";
import { useState, useEffect } from "react";
import * as SpellsClass from "../models"; // Spell, Action, Potency, Mastery
import * as Schools from "../Schools"; // single import for all schools
import Select from "../Select";

export default function SpellCreatorPage() {
  // Available schools (keys of Schools object)
  const schoolNames = Object.keys(Schools);

  // State for selections
  const [school, setSchool] = useState<string>(schoolNames[0] || "");
  const [branch, setBranch] = useState<string>("");
  const [spellName, setSpellName] = useState<string>("");

  // Parent spell state
  const [spell, setSpell] = useState<SpellsClass.Spell>(
    new SpellsClass.Spell(),
  );

  type ActiveSpellProps = {
    ParentMastery: SpellsClass.Mastery;
    active: boolean;
  };

  function renderSpell(args: {
    item: React.ComponentType<ActiveSpellProps>;
    props: ActiveSpellProps;
  }) {
    const Component = args.item;
    return <Component {...args.props} />;
  }

  useEffect(() => {
    if (!spell.mastery) {
      let basicSpell: SpellsClass.Spell = spell;
      basicSpell.mastery.novice();
      basicSpell.potency.minor();
      setSpell(basicSpell);
    }
  }, []);

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
  const activeSpell: ActiveSpellProps = {
    ParentMastery: spell.mastery,
    active: true,
  };

  const SpellComponent =
    branch && spellName && selectedSchool
      ? (selectedSchool as any)[branch][spellName]
      : null;

  // console.log({
  //   1: SpellComponent,
  //   2: branch,
  //   3: spellName,
  //   4: selectedSchool,
  // });
  // Update spell state
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateSpell = (field: string, value: any) => {
    setSpell((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Fixed Blank Banner */}
      <div className="fixed top-0 left-0 w-full h-20 bg-gray-800 shadow-md z-50 border-b border-gray-700">
        {/* Reserved for future banner content */}
      </div>

      {/* Main Content */}
      <div className="pt-24 max-w-4xl mx-auto p-6 grid gap-6">
        <h1
          className="
    text-4xl font-extrabold text-center cursor-help
    bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500
    bg-[length:200%_200%]
    bg-clip-text text-transparent
    animate-gradient
  "
          title="Select a School first, then choose a Branch, and finally select a Spell."
        >
          Spell Creator
        </h1>

        {/* School Selector */}
        <div className="grid gap-2">
          <label className="text-sm font-semibold uppercase tracking-wide text-cyan-400">
            School
          </label>
          <Select
            title={school}
            choices={schoolNames}
            changeChoice={(s) => {
              setSchool(s);
              setBranch("");
              setSpellName("");
            }}
          />
        </div>

        {/* Branch Selector */}
        <div className="grid gap-2">
          <label className="text-sm font-semibold uppercase tracking-wide text-cyan-400">
            Branch
          </label>
          <Select
            title={branch}
            choices={branches}
            changeChoice={(b) => {
              setBranch(b);
              setSpellName("");
            }}
          />
        </div>

        {/* Spell Selector */}
        <div className="grid gap-2">
          <label className="text-sm font-semibold uppercase tracking-wide text-cyan-400">
            Spell
          </label>
          <Select
            title={spellName}
            choices={spellsInBranch}
            changeChoice={(s) => setSpellName(s)}
          />
        </div>

        {/* Render spell component */}
        <div className="mt-4">
          {SpellComponent ? (
            renderSpell({ item: SpellComponent, props: activeSpell })
          ) : (
            <div className="text-gray-400">No spell selected</div>
          )}
        </div>

        {/* Output */}
        <div className="p-4 rounded bg-gray-800 border border-gray-700 shadow mt-6">
          <pre className="text-sm text-green-400">
            {JSON.stringify({ ...spell, school, branch, spellName }, null, 2)}
            {spell.mastery.getType()}
          </pre>
        </div>
      </div>
    </div>
  );
}
