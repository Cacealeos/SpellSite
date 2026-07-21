export type AppliedEffect = {
  label: string;
  info: string[];
};

export const appliedEffects: AppliedEffect[] = [
  {
    label: "Kinetics: Construct",
    info: [
      "Allows for creation of a predetermined set of constructs known by the user (not the caster). If applied to a target that doesn't know the applied construct, only one construct may be built during the course of the spell.",
      "Uses INTERACT action.",
    ],
  },
  {
    label: "Kinetics Field",
    info: [
      "Allows the user to build a field by playing DEFENSIVELY.",
      "Changes DAMAGE TYPE to: KINETIC.",
      "Only one projection per turn.",
    ],
  },
  {
    label: "Seal Ward",
    info: [
      "Adds Bonus to SEALING saves.",
      "Minor (+1): 50 / 35 / 20",
      "Major (+2): 75 / 60 / 45",
      "Extreme (+3): 100 / 85 / 70",
      "Does NOT stack.",
    ],
  },
  {
    label: "Body Ward",
    info: [
      "Reduces damage from body-energy attacks against the target by a percentage.",
      "Multiplicatively stacks with Damage Resistance and defensive techniques.",
      "Fails against attacks that exceed the target's Endurance disparity by 2 or more.",
      "Minor (+1): 50 / 35 / 20",
      "Major (+2): 75 / 60 / 45",
      "Extreme (+3): 100 / 85 / 70",
      "Grants SLIGHT resistance to EXPLOSIVE damage that doesn't exceed (Target END + 1).",
    ],
  },
  {
    label: "Mental Ward",
    info: [
      "Reduces damage from mental-energy attacks against the target by a percentage.",
      "Multiplicatively stacks with Damage Resistance and defensive techniques.",
      "Fails against attacks that exceed the target's Endurance disparity by 2 or more.",
      "Minor (+1): 50 / 35 / 20",
      "Major (+2): 75 / 60 / 45",
      "Extreme (+3): 100 / 85 / 70",
      "Grants SLIGHT resistance to PRESSURE damage that doesn't exceed (Target END + 1).",
    ],
  },
  {
    label: "Memory Ward",
    info: [
      "Reduces damage from memory-energy attacks against the target by a percentage.",
      "Multiplicatively stacks with Damage Resistance and defensive techniques.",
      "Fails against attacks that exceed the target's Endurance disparity by 2 or more.",
      "Minor (+1): 50 / 35 / 20",
      "Major (+2): 75 / 60 / 45",
      "Extreme (+3): 100 / 85 / 70",
      "Grants SLIGHT resistance to KINETIC damage that doesn't exceed (Target END + 1).",
    ],
  },
  {
    label: "Spirit Ward",
    info: [
      "Allows the target weapon to produce large yields of radiation of choice.",
      "Changes DAMAGE TYPE to: ELECTRIC.",
      "Requires Spellcraft Lore 2 or a related Elder Magic spell.",
    ],
  },
  {
    label: "Insulation Ward",
    info: [
      "Allows the target weapon to emit powerful magnetism.",
      "Changes DAMAGE TYPE to: ELECTRIC.",
      "Requires Spellcraft Lore 2 or a related Elder Magic spell.",
    ],
  },
  {
    label: "Paramagnetic Ward",
    info: [
      "Allows the target weapon to emit powerful gravity.",
      "Changes DAMAGE TYPE to: GRAVITY.",
      "Requires Spellcraft Lore 2 or a related Elder Magic spell.",
    ],
  },
  {
    label: "Repulsion Ward",
    info: [
      "Unleashes an Elder Magic spell by charging it into the target weapon.",
      "Power of the spell cannot exceed the weapon's Stress Tolerance.",
    ],
  },
  {
    label: "Refraction Ward",
    info: [
      "Places or connects existing portals.",
      "Requires Spellcraft Lore 2 and the appropriate Portal spell.",
      "Uses INTERACT action.",
    ],
  },
] as const;
