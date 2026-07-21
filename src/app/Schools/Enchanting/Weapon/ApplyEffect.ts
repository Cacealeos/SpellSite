export interface AppliedWeapon {
  label: string;
  info: string[];
}

export const appliedWeapons: AppliedWeapon[] = [
  {
    label: "Plying Rod",
    info: [
      "Allows the target weapon to serve as a 'Plying Instrument' and passively cast any Plying spell it has been enchanted with.",
      "Uses INTERACT action.",
    ],
  },
  {
    label: "Kinetics Rod: Projection",
    info: [
      "Allows the target weapon to Unleash a projection at the user's discretion upon a successful normal attack.",
      "Changes DAMAGE TYPE to: KINETIC.",
      "Only one projection per turn.",
    ],
  },
  {
    label: "Kinetics Rod: Ray",
    info: [
      "Allows the user to produce and/or reflect a Ray at the user's discretion upon a successful normal attack.",
      "Changes DAMAGE TYPE to: KINETIC.",
      "Reflected rays cannot exceed the power of the user.",
      "Sustaining reflected Rays requires an INTERACT action every turn and defensive play.",
      "Only one Ray per turn.",
    ],
  },
  {
    label: "Conjuration Rod",
    info: [
      "Allows the Unleash of a Conjuration spell at the user's discretion or after a successful attack.",
      "Changes DAMAGE TYPE to match that of the Conjuration type.",
      "Only one Unleash per turn.",
    ],
  },
  {
    label: "Etcher Rod",
    info: [
      "Allows the target weapon to be used as a sealing medium that applies an Etching Seal.",
      "Weapon Quality (STRESS) affects sealing strength.",
      "The weapon must be embedded after a successful attack to complete the seal.",
    ],
  },
  {
    label: "Catalyst Rod",
    info: [
      "Allows the target weapon to Unleash an applicable Energy Technique controlled by the caster. |GMD|",
      "+30% additional cost of the technique.",
      "Changes DAMAGE TYPE to match that of the Energy Technique.",
      "Only one technique per turn.",
    ],
  },
  {
    label: "Radiation Rod",
    info: [
      "Allows the target weapon to produce large yields of radiation of choice.",
      "Changes DAMAGE TYPE to: ELECTRIC.",
      "Requires Spellcraft Lore 2 or a related Elder Magic spell.",
    ],
  },
  {
    label: "Magnetism Rod",
    info: [
      "Allows the target weapon to emit powerful magnetism.",
      "Changes DAMAGE TYPE to: ELECTRIC.",
      "Requires Spellcraft Lore 2 or a related Elder Magic spell.",
    ],
  },
  {
    label: "Gravitation Rod",
    info: [
      "Allows the target weapon to emit powerful gravity.",
      "Changes DAMAGE TYPE to: GRAVITY.",
      "Requires Spellcraft Lore 2 or a related Elder Magic spell.",
    ],
  },
  {
    label: "Augmentation Rod",
    info: [
      "Unleashes an Elder Magic spell by charging it into the target weapon.",
      "The power of the spell cannot exceed the weapon's STRESS tolerance.",
    ],
  },
  {
    label: "Portal Rod",
    info: [
      "Places or connects existing portals.",
      "Requires Spellcraft Lore 2 and the appropriate Portal spell.",
      "Uses INTERACT action.",
    ],
  },
];
