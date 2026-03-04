import React, { useState } from "react";
import { Mastery } from "../../../models/Mastery";
import Select from "@/app/Select";

const DominateDash = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState(0);
  const [type, setType] = useState("");
  const Types: string[] = ["Structure", "Entity"];

  let testMastery: Mastery = new Mastery();
  let rate: number = 0;

  if (Types.indexOf(type) == 0 || Types.indexOf(type) == 1) {
    rate = 1;
  } else if (Types.indexOf(type) == 2 || Types.indexOf(type) == 3) {
    rate = 2;
  } else if (Types.indexOf(type) == 4) {
    rate = 3;
  }

  function changeChoice(choice: string) {
    setType(choice);
  }

  if (!active) setCost(0);

  if (ParentMastery.getType() == testMastery.novice()) rate = 10;
  else if (ParentMastery.getType() == testMastery.intermediate()) rate = 5;
  else if (ParentMastery.getType() == testMastery.mastered()) rate = 3;

  return (
    <>
      <div>
        <h1>Dominate Dash</h1>
        <br />
        <input
          type="number"
          min="0"
          step="1"
          value={cost}
          onChange={(e) => setCost(Number(e.target.value))}
        />
        <br />
      </div>
      <Select
        choices={Types}
        changeChoice={() => changeChoice}
        title="Type"
      ></Select>
    </>
  );
};

export default DominateDash;
