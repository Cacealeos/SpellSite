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
          renderSpell({ item: SpellComponent, props: activeSpell })
        ) : (
          <div>No spell selected</div>
        )}
      </div>

      {/* Output */}
      <div className="p-4 rounded bg-gray-100 shadow mt-6">
        <pre>
          {JSON.stringify({ ...spell, school, branch, spellName }, null, 2)}
          {spell.mastery.getType()}
        </pre>
      </div>
    </div>
  );
}
