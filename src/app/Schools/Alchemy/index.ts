//Baryonic
import TransmuteMass from "./Baryonic/TransmuteMass";
import TransmuteArch from "./Baryonic/TransmuteObject";
import TransmuteObject from "./Baryonic/TransmuteObject";
import TransmutePart from "./Baryonic/TransmuteParticle";

//MetaPhysical
import TransmuteGravity from "./MetaPhysical/TransmuteGravity";
import TransmuteLightHeat from "./MetaPhysical/TransmuteLightHeat";
import TransmuteAvatar from "./MetaPhysical/TransmuteAvatar";

//Structured
import Conjoin from "./Structured/Conjoin";
import Manifest from "./Structured/Manifest";
import Transform from "./Structured/Transform";

//Dimensional
import TransmuteCacealeos from "./Dimensional/TransmuteCacealeos";
import TransmuteDimensional from "./Dimensional/TransmuteDimensional";
import TransmuteSubstrate from "./Dimensional/TransmuteSubstrate";

export const Alchemy = {
  Baryonic: { TransmuteMass, TransmuteArch, TransmutePart, TransmuteObject },
  Metaphyscial: { TransmuteGravity, TransmuteLightHeat, TransmuteAvatar },
  Structured: { Conjoin, Manifest, Transform },
  Dimensional: { TransmuteCacealeos, TransmuteDimensional, TransmuteSubstrate },
};
