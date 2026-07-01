export const elements = {
  "Heat & Cold": {
    damage: "THERMAL",
    range: "RANGE - MISSILE",
    emanates: "USER",
    effect: [
      "Impairs (Blinds, Ignites, Melts, Disables, Immobilizes, etc.).",
      "Possible POWER vs DIS check against susceptible target(s).",
      "Failures deal pain equal to 100 × POWER.",
    ],
  },

  "Earth & Water": {
    damage: "PRESSURE",
    range: "RANGE - RADIAL",
    emanates: "ENVIRONMENT",
    effect: ["Targets lose defensive actions with a POWER vs POWER check."],
  },

  Wind: {
    damage: "ELECTRIC",
    range: "RANGE - CLOUD",
    emanates: "ENVIRONMENT",
    effect: [
      "Targets become dismembered after failing a POWER × 3 vs END save.",
    ],
  },

  Lightning: {
    damage: "ELECTRIC",
    range: "RANGE - MISSILE",
    emanates: "USER",
    effect: [
      "Target armor and weapons are damaged if susceptible.",
      "Durability damage equals 100 × POWER.",
      "Damage is doubled if POWER exceeds the target's END Stress Threshold.",
    ],
  },
} as const;

export const force = {
  Gas: {
    Damage: "Deals NO DAMAGE",
    Range: "RANGE - RADIAL",
  },
  Solids: {
    Damage: "Deals NO DAMAGE",
    Range: "RANGE - MISSILE",
  },
  Fluids: {
    Damage: "Deals NO DAMAGE",
    Range: "RANGE - CLOUD/RADIAL",
  },
  Plasma: {
    Damage: "Deals NO DAMAGE",
    Range: "RANGE - RADIAL",
  },
};
