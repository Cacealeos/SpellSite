//Conjuration
import ConjureElement from "./Conjuration/ConjureElement";
import ConjureForce from "./Conjuration/ConjureForce";

//Resonation
import GatherResonance from "./Resonation/GatherResonance";
import InterpolateWave from "./Resonation/InterpolateWave";
import ProjectWave from "./Resonation/ProjectWave";
import ResonateSpell from "./Resonation/ResonateSpell";
import ScrambleSig from "./Resonation/ScrambleSig";
import StabilizeEnvironment from "./Resonation/StabilizeEnvironment";

//Restoration
import MannaHealing from "./Restoration/Healing";
import PainHealing from "./Restoration/PainHealing";
import DisruptionRec from "./Restoration/DisruptionRec";
import FortifyLF from "./Restoration/FortifyLF";
import FortifyPT from "./Restoration/FortifyPT";
import ReConstitute from "./Restoration/ReConstitute";
import RegenLF from "./Restoration/RegenLF";
import BreakSeal from "./Restoration/BreakSeal";

//Saturation
import CollapseSaturation from "./Saturation/CollapseSaturation";
import DiluteSaturation from "./Saturation/DiluteSaturation";
import DisruptTarget from "./Saturation/DisruptTarget";
import FilterSaturation from "./Saturation/FilterSaturation";
import FluctuateSaturation from "./Saturation/FluctuateSaturation";

export const HighMagic = {
  Conjuration: { ConjureElement, ConjureForce },
  Resonation: {
    GatherResonance,
    InterpolateWave,
    ProjectWave,
    ResonateSpell,
    ScrambleSig,
    StabilizeEnvironment,
  },
  Restoration: {
    MannaHealing,
    PainHealing,
    DisruptionRec,
    FortifyLF,
    FortifyPT,
    ReConstitute,
    RegenLF,
    BreakSeal,
  },
  Saturation: {
    CollapseSaturation,
    DiluteSaturation,
    DisruptTarget,
    FilterSaturation,
    FluctuateSaturation,
  },
};
