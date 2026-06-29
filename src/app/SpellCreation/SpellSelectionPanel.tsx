import Select from "../Select";

type SpellSelectionPanelProps = {
  school: string;
  branch: string;
  spellName: string;

  schoolNames: string[];
  branches: string[];
  spellsInBranch: string[];

  schoolDescription: string;
  branchDescription: string;

  setSchool: (value: string) => void;
  setBranch: (value: string) => void;
  setSpellName: (value: string) => void;
};

export default function SpellSelectionPanel({
  school,
  branch,
  spellName,

  schoolNames,
  branches,
  spellsInBranch,

  schoolDescription,
  branchDescription,

  setSchool,
  setBranch,
  setSpellName,
}: SpellSelectionPanelProps) {
  return (
    <div className="space-y-6">
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

      {/* Context Panel */}
      <div className="grid gap-6 p-4 rounded-xl bg-gray-800 border border-gray-700 shadow text-center">
        {/* School */}
        <div>
          <h2 className="text-lg font-bold text-cyan-400 underline underline-offset-4">
            {school || "No School Selected"}
          </h2>

          <p className="text-sm text-gray-300 mt-2">
            {schoolDescription || "Select a school to view its description."}
          </p>
        </div>

        {/* Branch */}
        <div className="border-t border-gray-700 pt-4">
          <h3 className="text-md font-semibold text-purple-400 underline underline-offset-4">
            {branch || "No Branch Selected"}
          </h3>

          <p className="text-sm text-gray-400 mt-2">
            {branchDescription || "Select a branch to view its description."}
          </p>
        </div>
      </div>
    </div>
  );
}
