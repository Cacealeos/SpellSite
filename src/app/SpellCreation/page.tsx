"use client";
import React from "react";
import { useState, useEffect, useCallback } from "react";
import { Spell } from "../models";
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
  const [activeTab, setActiveTab] = useState<"fields" | "json">("fields");

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

  const potencyColorMap = {
    Minor: {
      border: "border-green-400/60",
      glow: "shadow-green-500/20",
      bg: "bg-gradient-to-br from-green-500/10 via-gray-900 to-gray-950",
    },
    Major: {
      border: "border-cyan-400/60",
      glow: "shadow-cyan-500/25",
      bg: "bg-gradient-to-br from-cyan-500/10 via-gray-900 to-gray-950",
    },
    Extreme: {
      border: "border-purple-400/60",
      glow: "shadow-purple-500/30",
      bg: "bg-gradient-to-br from-purple-500/15 via-gray-900 to-gray-950",
    },
    Cataclysmic: {
      border: "border-orange-400/70",
      glow: "shadow-orange-500/35",
      bg: "bg-gradient-to-br from-orange-500/15 via-gray-900 to-gray-950",
    },
    default: {
      border: "border-gray-700",
      glow: "shadow-black/20",
      bg: "bg-gray-900",
    },
  };

  const potencyType = spell.potency?.getType?.();
  const potencyColor =
    potencyColorMap[potencyType as keyof typeof potencyColorMap] ??
    potencyColorMap.default;

  const getStatColor = (
    value: number,
    type: "cost" | "ttt" | "requirement",
  ) => {
    let low = 0;
    let medium = 0;
    let high = 0;
    let red = 0;

    switch (type) {
      case "cost":
        low = 25;
        medium = 49;
        high = 99;
        red = 299;
        break;

      case "ttt":
        low = 5;
        medium = 10;
        high = 20;
        red = 40;
        break;

      case "requirement":
        low = 3;
        medium = 5;
        high = 7;
        red = 9;
        break;
    }

    // 🔴 RED (hard threshold)
    if (value >= red) {
      return {
        border: "border-red-500/80",
        glow: "shadow-red-500/40",
        bg: "from-red-500/25 to-red-900/10",
        text: "text-red-300",
      };
    }

    // 🟠 ORANGE (between high and red)
    if (value >= high) {
      return {
        border: "border-orange-400/80",
        glow: "shadow-orange-500/40",
        bg: "from-orange-500/25 to-amber-500/10",
        text: "text-orange-300",
      };
    }

    // 🟣 PURPLE
    if (value >= medium) {
      return {
        border: "border-purple-400/70",
        glow: "shadow-purple-500/30",
        bg: "from-purple-500/20 to-fuchsia-500/10",
        text: "text-purple-300",
      };
    }

    // 🔵 BLUE
    if (value >= low) {
      return {
        border: "border-cyan-400/70",
        glow: "shadow-cyan-500/30",
        bg: "from-cyan-500/20 to-blue-500/10",
        text: "text-cyan-300",
      };
    }

    // 🟢 GREEN fallback
    return {
      border: "border-green-400/70",
      glow: "shadow-green-500/30",
      bg: "from-green-500/20 to-emerald-500/10",
      text: "text-green-300",
    };
  };

  const stats: {
    label: string;
    value: number;
    type: "cost" | "ttt" | "requirement";
  }[] = [
    {
      label: spell.demon ? "Demon" : "Manna",
      value: spell.cost ?? 0,
      type: "cost",
    },
    {
      label: "TTT",
      value: spell.ttt ?? 0,
      type: "ttt",
    },
    {
      label: "Intelligence",
      value: spell.requirement ?? 0,
      type: "requirement",
    },
  ];

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
        {/* Spell Statistics */}

        {/* Mastery Controls */}

        <div className="flex justify-center mt-4">
          <button
            onClick={cycleMastery}
            className="
      px-6 py-3 rounded-lg
      border border-purple-500/50
      bg-gray-800
      text-purple-300
      font-semibold
      shadow-lg shadow-purple-500/20
      hover:bg-purple-900/30
      hover:border-purple-400
      transition-all duration-300
    "
          >
            Mastery: {spell.mastery.getType()}
          </button>
        </div>

        <div
          className={`
    rounded-xl border shadow-xl p-6
    transition-all duration-500
    ${potencyColor.border}
    ${potencyColor.glow}
    ${potencyColor.bg}
  `}
        >
          <div className="flex flex-wrap justify-center gap-8">
            {stats.map((stat) => {
              const colors = getStatColor(stat.value, stat.type);

              return (
                <div
                  key={stat.label}
                  className="flex flex-col items-center gap-3"
                >
                  <div
                    className={`
            w-28 h-28 rounded-full
            border-2 shadow-lg
            bg-gradient-to-br
            flex flex-col items-center justify-center
            transition-all duration-500
            ${colors.border}
            ${colors.glow}
            ${colors.bg}
          `}
                  >
                    <div className="text-xs uppercase tracking-widest text-gray-400">
                      {stat.label}
                    </div>

                    <div className={`text-3xl font-extrabold ${colors.text}`}>
                      {stat.value}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => setDebugTick((t) => t + 1)}
          className="px-3 py-1 text-sm bg-gray-700 rounded"
        >
          Reroll Debug Spell
        </button>

        {/* Render spell component */}
        <div className="mt-4">
          {SpellComponent ? (
            renderSpell({ item: SpellComponent, props: activeSpell })
          ) : (
            <div className="text-gray-400">No spell selected</div>
          )}
        </div>

        <div className="mt-6 rounded bg-gray-800 border border-gray-700 shadow">
          {/* Tabs */}
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab("fields")}
              className={`px-4 py-2 text-sm font-medium transition ${
                activeTab === "fields"
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
            >
              Spell Fields
            </button>

            <button
              onClick={() => setActiveTab("json")}
              className={`px-4 py-2 text-sm font-medium transition ${
                activeTab === "json"
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
            >
              JSON Output
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            {activeTab === "fields" ? (
              <div className="space-y-2 text-sm text-green-400">
                <div>
                  <span className="text-gray-300">Name:</span> {spellName}
                </div>
                <div>
                  <span className="text-gray-300">School:</span> {school}
                </div>
                <div>
                  <span className="text-gray-300">Branch:</span> {branch}
                </div>
                <div>
                  <span className="text-gray-300">Base:</span> {spell.base}
                </div>
                <div>
                  <span className="text-gray-300">Cost:</span> {spell.cost}
                </div>
                <div>
                  <span className="text-gray-300">Requirement:</span>{" "}
                  {spell.requirement}
                </div>
                <div>
                  <span className="text-gray-300">Root:</span> {spell.root}
                </div>
                <div>
                  <span className="text-gray-300">Demon:</span>{" "}
                  {spell.demon ? "Yes" : "No"}
                </div>
                <div>
                  <span className="text-gray-300">Compound:</span>{" "}
                  {spell.compound ? "Yes" : "No"}
                </div>
                <div>
                  <span className="text-gray-300">Mastery Type:</span>{" "}
                  {spell.mastery.getType()}
                </div>
              </div>
            ) : (
              <pre className="text-sm text-green-400 overflow-auto whitespace-pre-wrap">
                {JSON.stringify(
                  { ...spell, school, branch, spellName },
                  null,
                  2,
                )}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
