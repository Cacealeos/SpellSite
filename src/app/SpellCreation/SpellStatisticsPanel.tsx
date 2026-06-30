import { Spell } from "../models";

type StatType = "cost" | "ttt" | "requirement";

type Stat = {
  label: string;
  value: number;
  type: StatType;
};

type StatColor = {
  border: string;
  glow: string;
  bg: string;
  text: string;
};

type SpellStatisticsPanelProps = {
  spell: Spell;
  cycleMastery: () => void;
  rerollDebug: () => void;
};

const POTENCY_COLOR_MAP = {
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
} as const;

function getStatColor(value: number, type: StatType): StatColor {
  let low: number;
  let medium: number;
  let high: number;
  let red: number;

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

  if (value <= low) {
    return {
      border: "border-green-400/60",
      glow: "shadow-green-500/20",
      bg: "from-green-500/10 to-gray-900",
      text: "text-green-300",
    };
  }

  if (value <= medium) {
    return {
      border: "border-cyan-400/60",
      glow: "shadow-cyan-500/20",
      bg: "from-cyan-500/10 to-gray-900",
      text: "text-cyan-300",
    };
  }

  if (value <= high) {
    return {
      border: "border-purple-400/60",
      glow: "shadow-purple-500/25",
      bg: "from-purple-500/10 to-gray-900",
      text: "text-purple-300",
    };
  }

  if (value <= red) {
    return {
      border: "border-orange-400/60",
      glow: "shadow-orange-500/25",
      bg: "from-orange-500/10 to-gray-900",
      text: "text-orange-300",
    };
  }

  return {
    border: "border-red-500/60",
    glow: "shadow-red-500/30",
    bg: "from-red-500/15 to-gray-900",
    text: "text-red-300",
  };
}

export default function SpellStatisticsPanel({
  spell,
  cycleMastery,
  rerollDebug,
}: SpellStatisticsPanelProps) {
  const stats: Stat[] = [
    {
      label: "Cost",
      value: spell.cost,
      type: "cost",
    },
    {
      label: "TTT",
      value: spell.ttt,
      type: "ttt",
    },
    {
      label: "Requirement",
      value: spell.requirement,
      type: "requirement",
    },
  ];

  const potencyType = spell.potency.getType();

  const potencyColor =
    POTENCY_COLOR_MAP[potencyType as keyof typeof POTENCY_COLOR_MAP] ??
    POTENCY_COLOR_MAP.default;

  return (
    <div className="space-y-6">
      {/* Mastery Controls */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={cycleMastery}
          className="
            rounded-lg
            border border-purple-500/50
            bg-gray-800
            px-6 py-3
            font-semibold
            text-purple-300
            shadow-lg shadow-purple-500/20
            transition-all duration-300
            hover:border-purple-400
            hover:bg-purple-900/30
          "
        >
          Mastery: {spell.mastery.getType()}
        </button>
      </div>

      {/* Stats Container */}
      <div
        className={`
          rounded-xl
          border
          p-6
          shadow-xl
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
                    flex h-28 w-28 flex-col items-center justify-center
                    rounded-full
                    border-2
                    bg-gradient-to-br
                    shadow-lg
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
          className="rounded bg-gray-700 px-3 py-1 text-sm transition hover:bg-gray-600"
        >
          Reroll Debug Spell
        </button>
      </div>
    </div>
  );
}
