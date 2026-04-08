//Draw
import DrawCatalyst from "./Draw/DrawCatalyst";
import DrawLifeDeath from "./Draw/DrawLife&Death";
import DrawMemory from "./Draw/DrawMemory";
import DrawMind from "./Draw/DrawMind";
import DrawSoul from "./Draw/DrawSoulEnergy";

//Extract
import AwakenNature from "./Extract/AwakenNature";
import DirectNature from "./Extract/DirectNature";
import SummonNature from "./Extract/SummonNature";
import UnleashPotential from "./Extract/UnleashPotential";

//Rejuvenation
import RejuvenateLife from "./Rejuventation/RejuvenateLife";
import RejuvenateMemory from "./Rejuventation/RejuvenateMemory";
import RejuvenateMind from "./Rejuventation/RejuvenateMind";
import RejuvenateSpirit from "./Rejuventation/RejuvenateSpirit";
import RejuvenateSoul from "./Rejuventation/RejuvenateSoul";
import RepairSeal from "./Rejuventation/RepairSeal";
import Revival from "./Rejuventation/Revival";

export const Trascendentalism = {
  Draw: { DrawCatalyst, DrawLifeDeath, DrawSoul, DrawMemory, DrawMind },
  Extract: { AwakenNature, DirectNature, SummonNature, UnleashPotential },
  Rejuvenation: {
    RejuvenateLife,
    RejuvenateMemory,
    RejuvenateMind,
    RejuvenateSoul,
    RejuvenateSpirit,
    RepairSeal,
    Revival,
  },
};
