import { Spell } from "../models";

type StatType = "cost" | "ttt" | "requirement";

type Stat = {
  label: string;
  value: number;
  type: StatType;
};

type SpellStatisticsPanelProps = {
  spell: any;
  stats: Stat[];

  potencyColor: {
    border: string;
    glow: string;
    bg: string;
  };

  getStatColor: (
    value: number,
    type: StatType,
  ) => {
    border: string;
    glow: string;
    bg: string;
    text: string;
  };

  cycleMastery: () => void;
  rerollDebug: () => void;
};

export default function SpellStatisticsPanel({
  spell,
  stats,
  potencyColor,
  getStatColor,
  cycleMastery,
  rerollDebug,
}: SpellStatisticsPanelProps) {
  return (
    <div className="space-y-6">
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

      {/* Stats Container */}
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

      {/* Debug Button */}
      <div className="flex justify-center">
        <button
          onClick={rerollDebug}
          className="px-3 py-1 text-sm bg-gray-700 rounded hover:bg-gray-600 transition"
        >
          Reroll Debug Spell
        </button>
      </div>
    </div>
  );
}
