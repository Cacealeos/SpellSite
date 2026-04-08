//Possession
import PossessDash from "./Possession/PossessDash";
import PossessMount from "./Possession/PossessMount";
import PossessSprint from "./Possession/PossessSprint";
import PossessSustain from "./Possession/PossessSustain";

//Domination
import DominateDash from "./Domination/DominateDash";
import DominateMount from "./Domination/DominationMount";
import DominateSprint from "./Domination/DominateSprint";
import DominateSustain from "./Domination/DominateSustain";

//Assimliation
import Assimilate from "./Assimilation/Assimilate";

//Animation
import AnimateEphemeral from "./Animation/AnimateEphermal";
import AnimateMaterial from "./Animation/AnimateMaterial";
import AuthorConsciousness from "./Animation/AuthorConsciousness";
import MergeAsymmertical from "./Animation/MergeAsymmetrical";
import MergeSymmetrical from "./Animation/MergeSymmetrical";

export const Sorecery = {
  Possession: { PossessDash, PossessMount, PossessSprint, PossessSustain },
  Dominate: { DominateDash, DominateMount, DominateSprint, DominateSustain },
  Assimilation: { Assimilate },
  Animation: {
    AnimateMaterial,
    AnimateEphemeral,
    AuthorConsciousness,
    MergeAsymmertical,
    MergeSymmetrical,
  },
};
