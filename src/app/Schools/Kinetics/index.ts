//Constructs
import Constructs from "./Constructs";
import ConstructsRepulsion from "./ConstructsRepulsion";
//Rays
import Rays from "./Rays";
//Fields
import Fields from "./Fields";
import FieldsRepulse from "./FieldsRepulsion";
//Projections
import Projections from "./Projections";
import ProjectionsRepulsion from "./ProjectionsRepulsion";

export const Kinetics = {
  Constructs: { Constructs, ConstructsRepulsion },
  Rays: { Rays },
  Fields: { Fields, FieldsRepulse },
  Projections: { Projections, ProjectionsRepulsion },
};
