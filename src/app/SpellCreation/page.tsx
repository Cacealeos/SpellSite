"use client";
import React from "react";
import { useState, useEffect, useCallback } from "react";
import { Spell } from "../models";

import * as SpellsClass from "../models"; // Spell, Action, Potency, Mastery
import * as Schools from "../Schools"; // single import for all schools
import { SchoolInfo } from "../Schools/SchoolInfo";
import SpellExportPanel from "./SpellExportPanel";
import SpellSelectionPanel from "./SpellSelectionPanel";
import SpellStatisticsPanel from "./SpellStatisticsPanel";

export default function SpellCreatorPage() {
  // Available schools (keys of Schools object)
  const schoolNames = Object.keys(Schools);

  // State for selections
  const [school, setSchool] = useState<string>(schoolNames[0] || "");
  const [branch, setBranch] = useState<string>("");
  const [spellName, setSpellName] = useState<string>("");

  // Descriptions for the currently selected school and branch
  const schoolDescription =
    SchoolInfo[school as keyof typeof SchoolInfo]?.description ?? "";

  const branchDescription =
    SchoolInfo[school as keyof typeof SchoolInfo]?.branches[
      branch as keyof (typeof SchoolInfo)[keyof typeof SchoolInfo]["branches"]
    ] ?? "";

  // Parent spell state
  const [spell, setSpell] = useState(() => new SpellsClass.Spell());

  type ActiveSpellProps = {
    ParentMastery: SpellsClass.Mastery;
    active: boolean;
    updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
  };

  function renderSpell(args: {
    item: React.ComponentType<ActiveSpellProps>;
    props: ActiveSpellProps;
  }) {
    const Component = args.item;
    return <Component {...args.props} />;
  }

  // Set default branch when school changes
  useEffect(() => {
    if (branches.length > 0) {
      setBranch(branches[0]);
    } else {
      setBranch("");
    }
  }, [school]);

  // Set default spell when branch changes
  useEffect(() => {
    if (spellsInBranch.length > 0) {
      setSpellName(spellsInBranch[0]);
    } else {
      setSpellName("");
    }
  }, [branch, school]);

  // DEBUGGING *************************************************************************************************************

  const [debugTick, setDebugTick] = useState(0);

  useEffect(() => {
    const debugSpell = new SpellsClass.Spell();

    debugSpell.cost = Math.floor(Math.random() * 300);
    debugSpell.ttt = Math.floor(Math.random() * 120);
    debugSpell.requirement = Math.floor(Math.random() * 10) + 1;
    debugSpell.demon = Math.random() > 0.5;

    const roll = Math.floor(Math.random() * 4);

    if (roll === 0) debugSpell.potency.minor();
    else if (roll === 1) debugSpell.potency.major();
    else if (roll === 2) debugSpell.potency.extreme();
    else debugSpell.potency.cataclysmic();

    setSpell(debugSpell);
  }, [debugTick]);

  // DEBUGGING *************************************************************************************************************

  // Get selected school object
  const selectedSchool = school
    ? Schools[school as keyof typeof Schools]
    : null;

  // Branches of selected school
  const branches = selectedSchool ? Object.keys(selectedSchool) : [];

  // Ensure branch is set
  // if (!branch && branches.length > 0) setBranch(branches[0]);

  // Spells in selected branch
  const spellsInBranch = branch
    ? Object.keys((selectedSchool as any)[branch])
    : [];

  // Ensure spellName is set
  // if (!spellName && spellsInBranch.length > 0) setSpellName(spellsInBranch[0]);

  const SpellComponent =
    branch && spellName && selectedSchool
      ? (selectedSchool as any)[branch][spellName]
      : null;

  // Update spell state
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateSpell = useCallback(
    <K extends keyof Spell>(field: K, value: Spell[K]) => {
      setSpell((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    [],
  );

  const cycleMastery = () => {
    setSpell((prev) => {
      const mastery = new SpellsClass.Mastery();

      switch (prev.mastery.getType()) {
        case "NOVICE":
          mastery.intermediate();
          break;

        case "INTERMEDIATE":
          mastery.mastered();
          break;

        case "MASTERED":
          mastery.novice();
          break;
      }

      return {
        ...prev,
        mastery,
      };
    });
  };

  // Selected spell component
  const activeSpell: ActiveSpellProps = {
    ParentMastery: spell.mastery,
    active: true,
    updateSpell,
  };

  useEffect(() => {
    setSpell((prev) => {
      const newSpell = new SpellsClass.Spell();

      newSpell.school = school;
      newSpell.branch = branch;
      newSpell.root = spellName;

      // Preserve mastery
      newSpell.mastery = prev.mastery;

      return newSpell;
    });
  }, [school, branch, spellName]);

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

        {/* Spell selection */}

        <SpellSelectionPanel
          school={school}
          branch={branch}
          spellName={spellName}
          schoolNames={schoolNames}
          branches={branches}
          spellsInBranch={spellsInBranch}
          schoolDescription={schoolDescription}
          branchDescription={branchDescription}
          setSchool={setSchool}
          setBranch={setBranch}
          setSpellName={setSpellName}
        />
        {/* Spell Statistics */}

        <SpellStatisticsPanel
          spell={spell}
          cycleMastery={cycleMastery}
          rerollDebug={() => setDebugTick((t) => t + 1)}
        />

        {/* Render spell component */}
        <div className="mt-4">
          {SpellComponent ? (
            renderSpell({ item: SpellComponent, props: activeSpell })
          ) : (
            <div className="text-gray-400">No spell selected</div>
          )}
        </div>

        {/* export spell */}

        <SpellExportPanel
          spell={spell}
          spellName={spellName}
          school={school}
          branch={branch}
        />
      </div>
    </div>
  );
}
