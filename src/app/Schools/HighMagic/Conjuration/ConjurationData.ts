export const elements = {
  "Heat & Cold": {
    Damage: "THERMAL DAMAGE",
    Range: "RANGE - MISSILE",
    Effect:
      "Impairs (Blinds, Ignites, Melts, Disable, Immobilize, etc.) Possible Power vs Dis Check against susceptible target(s) Failures deals pain of 100 x power",
    Emanates: "User",
  },
  "Earth & Water": {
    Damage: "PRESSURE DAMAGE",
    Range: "RANGE - RADIAL",
    Effect: "Targets lose defensive actions with a Power-to-Power check",
    Emanates: "ENVIRONMENT",
  },
  Wind: {
    Damage: "ELECTRIC DAMAGE",
    Range: "RANGE - CLOUD",
    Effect: "Targets become dismembered after failing a Power x 3 Vs End save",
    Emanates: "ENVIRONMENT",
  },
  Lightning: {
    Damage: "ELECTRIC DAMAGE",
    Range: "RANGE - MISSILE",
    Effect:
      "Target armor and weapons are damaged if susceptible. Durability damage equal to 100 x Power. (x2 if power exceeds target stress tolerance",
    Emanates: "USER",
  },
};

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
