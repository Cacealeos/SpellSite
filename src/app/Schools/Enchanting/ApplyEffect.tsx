import React, { useState, ChangeEvent } from "react";
import { Mastery } from "../../models/Mastery";
import Select from "@/app/Select";

const ApplyEffect = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState(0);
  const [checked, check] = useState<boolean>();
  const [choice, setChoice] = useState<number>(-1);
  let rate: number = 0;
  let testMastery: Mastery = new Mastery();

  const AppliedEffects = {
    0: "Plying Rod",
    1: "Kinetics Rod: Projection",
    2: "Kinetics Rod: Ray",
    3: "Conjuration Rod",
    4: "Etcher Rod",
    5: "Catalyst Rod",
    6: "Radiation Rod",
    7: "Magnetism Rod",
    8: "Gravitation Rod",
    9: "Augmentation Rod",
    10: "Portal Rod",
  };

  const AppliedInfo: Record<number, string[]> = {
    0: [
      "Allows for target weapon to serve as a “Plying Instrument” and passively cast any plying spell it has been enchanted with.",
      "Uses INTERACT action.",
    ],
    1: [
      "Allows for target weapon to Unleash a projection at user’s discretion upon successful normal attack.",
      "Changes DAMAGE TYPE to: KINETIC",
      "Only one projection per turn",
    ],
    2: [
      "Allows user to produce and/or reflect a Ray at user’s discretion upon successful normal attack.",
      "Changes DAMAGE TYPE to: KINETIC",
      "Reflected rays cannot exceed power of user.",
      "Sustaining Reflected Rays requires interact action every turn and defensive play",
      "Only one Ray per turn",
    ],
    3: [
      "Allows for the Unleash of Conjuration spell at user discretion or after successful attack.",
      "Changes DAMAGE TYPE to match that of Conjuration type",
      "Only one Unleash per turn.",
    ],
    4: [
      "Allows target weapon to be used as a sealing medium that will apply an etching seal.",
      "Weapon Quality (STRESS) affects sealing strength.",
      "Weapon must be embedded after successful attack to complete seal.",
    ],
    5: [
      "Allows target weapon to Unleash an applicable Energy Technique controlled by caster. (GMD)",
      "+ 30% Additional cost of technique",
      "Changes damage type to match that of Energy Tech",
      "Only one Tech per turn",
    ],
    6: [
      "Allows target weapon to produce large yields of radiation of choice",
      "Changes DAMAGE TYPE to: ELETRIC",
      "Requires Spell craft Lore of 2 or related Elder Magic spell",
    ],
    7: [
      "Allows target weapon to emit powerful magnetism",
      "Changes DAMAGE TYPE to: ELETRIC",
      "Requires Spell craft Lore of 2 or related Elder Magic spell",
    ],
    8: [
      "Allows target weapon to emit powerful gravity",
      "Changes DAMAGE TYPE to: GRAVITY",
      "Requires Spell craft Lore of 2 or related Elder Magic spell",
    ],
    9: [
      "Unleash Elder Magic spell by charging into target weapon",
      "Power of Spell CANNOT exceed Stress tolerance of Weapon",
    ],
    10: [
      "Place or connect placed Portal(s)",
      "Requires Spell craft Lore of 2 AND appropriate Portal Spell.",
      "Uses INTERACT action.",
    ],
  };

  if (!active) setCost(0);

  // const handleCheckBox = (event: ChangeEvent<HTMLInputElement>) => {
  //   const checkedState = event.target.checked;
  //   check(checkedState);
  //   if (checkedState) {
  //     if (Mastery.type == "NOVICE") rate = 20;
  //     else if (Mastery.type == "INTERMEDIATE") rate = 15;
  //     else if (Mastery.type == "MASTERED") rate = 10;

  //     setCost(rate || 0);
  //   }
  // };

  const changeChoice = (choice: string) => {
    for (const [key, val] of Object.entries(AppliedEffects)) {
      if (val === choice) setChoice(parseInt(key));
    }
    if (ParentMastery.getType() == testMastery.novice()) rate = 20;
    else if (ParentMastery.getType() == testMastery.intermediate()) rate = 15;
    else if (ParentMastery.getType() == testMastery.mastered()) rate = 10;

    setCost(rate || 0);
  };

  return (
    <>
      <div>
        <br />
        <Select
          title={"Applied Effects"}
          choices={Object.values(AppliedEffects)}
          changeChoice={changeChoice}
        ></Select>

        <br />
        {AppliedInfo[choice].map((info: string) => {
          return (
            <>
              <h4>Info: {info}</h4>
              <br />
            </>
          );
        })}
      </div>
      <br />
      <div>
        <input
          type="number"
          max="50"
          min="0"
          step="1"
          value="0"
          onChange={(e) => setCost(Number(e.target.value) * rate || 0)}
        />
        <br />
        <h4>Base Cost of Applied Spell</h4>
      </div>
    </>
  );
};

export default ApplyEffect;
