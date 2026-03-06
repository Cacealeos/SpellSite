import React, { useState } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models/Potency";

const ProjectedIllusion = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [smell, setSmell] = useState(false);
  const [sight, setSight] = useState(false);
  const [touch, setTouch] = useState(false);
  const [sound, setSound] = useState(false);
  const [taste, setTaste] = useState(false);
  const [manna, setManna] = useState(false);
  const [desc, setDesc] = useState("");

  let testMastery: Mastery = new Mastery();
  let TTT = 0;

  //  useEffect(() => {
  //    if (!active) setCosts([0,0]);
  //  }, [active]);

  function calculateCost(sense: number, size: number) {
    if (smell) TTT = +sense;
    if (sight) TTT = +sense;
    if (touch) TTT = +sense;
    if (sound) TTT = +sense;
    if (taste) TTT = +sense;
    if (desc) TTT = +sense;
    TTT += size;
  }

  const changeChoice = (size: number) => {
    if (ParentMastery.getType() === testMastery.novice(true)) {
      if (size === 1) calculateCost(15, 5);
      if (size === 2) calculateCost(15, 3);
      if (size === 3) calculateCost(15, 1);
    }
    if (ParentMastery.getType() === testMastery.intermediate(true)) {
      if (size === 1) calculateCost(10, 3);
      if (size === 2) calculateCost(10, 6);
      if (size === 3) calculateCost(10, 9);
    }
    if (ParentMastery.getType() === testMastery.mastered(true)) {
      if (size === 1) calculateCost(5, 7);
      if (size === 2) calculateCost(5, 11);
      if (size === 3) calculateCost(5, 15);
    }
  };

  return (
    <>
      <div>
        <h1>Projected Illusion</h1>
        <h3>RANGE - DIRECT</h3>
        <div>
          <h2>Impair Senses: 15 / 10 / 5</h2>
          <span>Sight</span>
          <input type="checkbox" onChange={() => setSight(!sight)} />
          <span>Smell</span>
          <input type="checkbox" onChange={() => setSmell(!smell)} />
          <span>Touch</span>
          <input type="checkbox" onChange={() => setTouch(!touch)} />
          <span>Taste</span>
          <input type="checkbox" onChange={() => setTaste(!taste)} />
          <span>Sound</span>
          <input type="checkbox" onChange={() => setSound(!sound)} />
          <span>Manna</span>
          <input type="checkbox" onChange={() => setManna(!manna)} />
        </div>
        <div>
          <p>Small + 5 / 3/ 1</p>
          <input type="radio" onChange={(e) => changeChoice(1)} />
        </div>
        <div>
          <p>Moderate AOE + 9 / 6 / 3</p>
          <input type="radio" onChange={(e) => changeChoice(2)} />
        </div>
        <div>
          <p>Large AOE + 15 / 11 / 7</p>
          <input type="radio" onChange={(e) => changeChoice(3)} />
        </div>
        <br />
        <textarea onChange={(e) => setDesc(e.target.value)}>{desc}</textarea>
      </div>
      <h1>TTT:{TTT}</h1>
    </>
  );
};

export default ProjectedIllusion;
