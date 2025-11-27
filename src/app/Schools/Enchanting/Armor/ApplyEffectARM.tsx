import React, { useState, ChangeEvent } from "react";
import { Mastery } from "../../../models/Mastery";
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

  let testMastery: Mastery = new Mastery();
  let rate: number = 0;

  const AppliedEffects = {
    0: "Kinetics: Construct",
    1: "Kinetics Field",
    2: "Seal Ward",
    3: "Body Ward",
    4: "Mental Ward",
    5: "Memory Ward",
    6: "Spirit Ward",
    7: "Insulation Ward",
    8: "Paramagnetic Ward",
    9: "Repulsion Ward",
    10: "Refraction Ward",
  };

  const AppliedInfo: Record<number, string[]> = {
    0: [
      "Allows for creation of predetermined set of constructs known by user (Not caster). If applied to target that doesn't know the applied construct, " +
      + "only one construct may built during the course of the spell",
      "Uses INTERACT action.",
    ],
    1: [
      "Allows user to build field by playing DEFENSIVELY.",
      "Changes DAMAGE TYPE to: KINETIC",
      "Only one projection per turn",
    ],
    2: [
      "Adds Bonus to SEALING saves", 
      "Minor(+1): 50 / 35 / 20",
      "Major(+2): 75 / 60 / 45",
      "Extreme(+3): 100 / 85 / 70",
      "Does NOT stack"
    ],
    3: [
      "Info: Reduce damage of body-energy attacks against target by a percentage. ",
      "Multplicatively Stacks with Damage resistance and defesive techniques",
      "Fails against attacks that exceed targety endurance disparity of 2 or more",
      "Minor(+1): 50 / 35 / 20",
      "Major(+2): 75 / 60 / 45",
      "Extreme(+3): 100 / 85 / 70",
      "Grants SLIGHT resistance to EXPLOSIVE damage that doesn't exceed (target End + 1)"
    ],
    4: [
      "Info: Reduce damage of mental-energy attacks against target by a percentage. ",
      "Multplicatively Stacks with Damage resistance and defesive techniques",
      "Fails against attacks that exceed targety endurance disparity of 2 or more",
      "Minor(+1): 50 / 35 / 20",
      "Major(+2): 75 / 60 / 45",
      "Extreme(+3): 100 / 85 / 70",
      "Grants SLIGHT resistance to PRESSURE damage that doesn't exceed (target End + 1)"
    ],
    5: [
      "Info: Reduce damage of memory-energy attacks against target by a percentage. ",
      "Multplicatively Stacks with Damage resistance and defesive techniques",
      "Fails against attacks that exceed targety endurance disparity of 2 or more",
      "Minor(+1): 50 / 35 / 20",
      "Major(+2): 75 / 60 / 45",
      "Extreme(+3): 100 / 85 / 70",
      "Grants SLIGHT resistance to KINETIC damage that doesn't exceed (target End + 1)"
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
    if (ParentMastery.getType() === testMastery.novice(true))  rate = 20;
    else if (ParentMastery.getType() === testMastery.intermediate(true))  rate = 15;
    else if (ParentMastery.getType() === testMastery.mastered(true))  rate = 10;

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
