import { useState } from "react";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";

import { Spell } from "../models";

type SpellExportPanelProps = {
  spell: Spell;
  spellName: string;
  school: string;
  branch: string;
};

export default function SpellExportPanel({
  spell,
  spellName,
  school,
  branch,
}: SpellExportPanelProps) {
  const [activeTab, setActiveTab] = useState<"fields" | "json">("fields");
  const [copied, setCopied] = useState(false);

  const exportData = {
    ...spell,
    school,
    branch,
    spellName,
  };

  const copyJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (err) {
      console.error("Failed to copy JSON:", err);
    }
  };

  return (
    <div className="mt-6 rounded border border-gray-700 bg-gray-800 shadow">
      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        <button
          onClick={() => setActiveTab("fields")}
          className={`px-4 py-2 text-sm font-medium transition ${
            activeTab === "fields"
              ? "bg-gray-700 text-white"
              : "text-gray-400 hover:bg-gray-700 hover:text-white"
          }`}
        >
          Spell Fields
        </button>

        <button
          onClick={() => setActiveTab("json")}
          className={`px-4 py-2 text-sm font-medium transition ${
            activeTab === "json"
              ? "bg-gray-700 text-white"
              : "text-gray-400 hover:bg-gray-700 hover:text-white"
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
          <div className="relative">
            <button
              onClick={copyJson}
              title="Copy JSON"
              className="absolute top-2 right-8 z-10 rounded-md bg-gray-800 border border-gray-700 p-2 text-cyan-400 shadow-lg transition hover:bg-gray-700 hover:text-cyan-300"
            >
              <ClipboardDocumentIcon className="h-5 w-5" />
            </button>

            {copied && (
              <div className="absolute top-3 right-16 z-10 text-xs font-medium text-green-400">
                Copied!
              </div>
            )}
            <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded text-sm text-green-400 pr-12">
              {JSON.stringify(exportData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
