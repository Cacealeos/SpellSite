// Enchanting/index.ts

// Armor branch
import AbsorbEnergy from "./Armor/AbsorbEnergy";
import Adherence from "./Armor/Adherence";
import Coherence from "./Armor/Coherence";
import DisruptionThresh from "./Armor/DisruptionThresh";
import Evasion from "./Armor/Evasion";
import PainThresh from "./Armor/PainThresh";
import TempDur from "./Armor/TempDur";

// Weapon branch
import Accuracy from "./Weapon/Accuracy";
import ApplyEffect from "./Weapon/ApplyEffect";
import Disruption from "./Weapon/Disruption";
import Pain from "./Weapon/Pain";
import SoulEnch from "./Weapon/SoulEnch";
import SpiritEnch from "./Weapon/SpiritEnch";
import Weapon_Damage from "./Weapon/Weapon_Damage";

// Object branch
import InstillEnergy from "./Object/InstillEnergy";
import InstillMotion from "./Object/InstillMotion";

// Export Enchanting school with nested branches
export const Enchanting = {
  Armor: {
    AbsorbEnergy,
    Adherence,
    Coherence,
    DisruptionThresh,
    Evasion,
    PainThresh,
    TempDur,
  },
  Weapon: {
    Accuracy,
    ApplyEffect,
    Disruption,
    Pain,
    SoulEnch,
    SpiritEnch,
    Weapon_Damage,
  },
  Object: {
    InstillEnergy,
    InstillMotion,
  },
};
