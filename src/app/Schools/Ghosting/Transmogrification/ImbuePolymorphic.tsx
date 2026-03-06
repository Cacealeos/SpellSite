import React, { useState, useEffect } from "react";
import { Mastery } from "../../../models/Mastery";

const ProjectedIllusion = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [costs, setCosts] = useState([0, 0]);
  const [desc, setDesc] = useState("");

  let testMastery: Mastery = new Mastery();
  let TTT = 0;

  useEffect(() => {
    if (!active) setCosts([0, 0]);
  }, [active]);

  function changeChoice(size: number) {
    if (ParentMastery.getType() === testMastery.novice(true)) {
      setCosts([100, 8 * size]);
    }
    if (ParentMastery.getType() === testMastery.intermediate(true)) {
      setCosts([70, 6 * size]);
    }
    if (ParentMastery.getType() === testMastery.mastered(true)) {
      setCosts([40, 4 * size]);
    }
  }

  return (
    <>
      <div>
        <h1>Imbue Polymorphic</h1>
        <h3>RANGE - MISSILE</h3>
        <h3>Base Cost: 100 / 70 / 40</h3>

        <h3>TTT: 8 / 6 / 4</h3>
        <div>
          <h4>Tiny: x 1/2</h4>
          <input type="radio" onChange={(e) => changeChoice(0.5)} />
        </div>
        <br />
        <div>
          <h4>Sizeable: x 1</h4>
          <input type="radio" onChange={(e) => changeChoice(1)} />
        </div>
        <br />
        <div>
          <h4>Enormous: x 2</h4>
          <input type="radio" onChange={(e) => changeChoice(2)} />
        </div>
        <br />
        <div>
          <h4>Gargantuan: x 4</h4>
          <input type="radio" onChange={(e) => changeChoice(4)} />
        </div>
        <br />

        <textarea onChange={(e) => setDesc(e.target.value)}>{desc}</textarea>
      </div>
      <h1>Base:{costs}</h1>
      <h1>TTT:{TTT}</h1>
    </>
  );
};

export default ProjectedIllusion;
