// Enchanting/index.ts

// Armor branch
import AbsorbEnergy from "./Armor/AbsorbEnergy";
import Adherence from "./Armor/Adherence";
import Coherence from "./Armor/Coherence";
import ApplyEffectA from "./Armor/ApplyEffectARM";
import DisruptionThresh from "./Armor/DisruptionThresh";
import Evasion from "./Armor/Evasion";
import PainThresh from "./Armor/PainThresh";
import TempDur from "./Armor/TempDur";

// Weapon branch
import Accuracy from "./Weapon/Accuracy";
import ApplyEffectW from "./Weapon/ApplyEffectWEAP";
import Disruption from "./Weapon/Disruption";
import Pain from "./Weapon/Pain";
import SoulEnch from "./Weapon/SoulEnch";
import SpiritEnch from "./Weapon/SpiritEnch";
import Weapon_Damage from "./Weapon/Weapon_Damage";

// Object branch
import InstillEnergy from "./Object/InstillEnergy";
import InstillMotion from "./Object/InstillMotion";
import ApplyEffectO from "./Object/ApplyEffectObj";

//Primal

import Anima from "./Primal/Anima";
import Bewitch from "./Primal/Bewitch";
import Flash from "./Primal/Flash";
import Gate from "./Primal/Gate";
import Synchronize from "./Primal/Synchronize";
import Array from "./Primal/Array";
import Conduit from "./Primal/Conduit";

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
    ApplyEffectA,
  },
  Weapon: {
    Accuracy,
    ApplyEffectW,
    Disruption,
    Pain,
    SoulEnch,
    SpiritEnch,
    Weapon_Damage,
  },
  Object: {
    InstillEnergy,
    InstillMotion,
    ApplyEffectO,
  },

  Primal: {
    Anima,
    Bewitch,
    Flash,
    Gate,
    Synchronize,
    Array,
    Conduit,
  },
};

//tracking, combine mental links, attch mental links, buff catalysr?? apply effect - deliverance + conjuration + etc, body seal enchantments that reduce cost in proximity,
