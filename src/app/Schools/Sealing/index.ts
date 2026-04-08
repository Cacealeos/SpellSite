//Transitive
import ImprisionEntity from "./Transitive/ImprisionEntity";
import ImprisionObject from "./Transitive/ImprisionObject";
import RecallSeal from "./Transitive/RecallSeal";
import SealMass from "./Transitive/SealMass";
import SealMetaphysical from "./Transitive/SealMetaphysical";
import UnlockSeal from "./Transitive/UnlockSeal";

//Etching
import ActionLimiter from "./Etching/ActionLimiter";
import CatalystLimiter from "./Etching/CatalystLimter";
import DisruptionLimiter from "./Etching/DisruptionDelimiter";
import IllusionSeal from "./Etching/IllusionSeal";
import LifeForceLimiter from "./Etching/LifeForceLimter";
import MannaLimiter from "./Etching/MannaLimter";
import MemoryLimiter from "./Etching/MemoryLImiter";
import MentalLimiter from "./Etching/MentalLimiter";
import PainDeLimiter from "./Etching/PainDelimiter";
import PossesionSeal from "./Etching/PossessionSeal";
import ReceptorLimiter from "./Etching/ReceptorLimiter";
import SpiritSoulLimiter from "./Etching/Spirit&SoulLimiter";

//Applied
import UnleashStructure from "./Applied/UnleashStructure";

//Body
import InscribePassive from "./Body/InscribePassiveSeal";
import InscribeSpellSeal from "./Body/InscribeSpell";

export const Sealing = {
  Transitive: {
    ImprisionEntity,
    ImprisionObject,
    RecallSeal,
    SealMass,
    SealMetaphysical,
    UnlockSeal,
  },
  Etching: {
    ActionLimiter,
    CatalystLimiter,
    DisruptionLimiter,
    IllusionSeal,
    LifeForceLimiter,
    MannaLimiter,
    MemoryLimiter,
    MentalLimiter,
    PainDeLimiter,
    PossesionSeal,
    ReceptorLimiter,
    SpiritSoulLimiter,
  },
  Applied: { UnleashStructure },
  Body: { InscribePassive, InscribeSpellSeal },
};
