import React, { useState } from "react";
import { Mastery } from "../../../models/Mastery";

const InducedIllusion = ({
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

  function calculateCost(sense: number) {
    if (smell) TTT = +sense;
    if (sight) TTT = +sense;
    if (touch) TTT = +sense;
    if (sound) TTT = +sense;
    if (taste) TTT = +sense;
    if (desc) TTT = +sense;
  }

  if (ParentMastery.getType() === testMastery.novice(true)) {
    calculateCost(9);
  }
  if (ParentMastery.getType() === testMastery.intermediate(true)) {
    calculateCost(6);
  }
  if (ParentMastery.getType() === testMastery.mastered(true)) {
    calculateCost(3);
  }

  return (
    <>
      <div>
        <h1>Induced Illusion</h1>
        <h3>RANGE - DIRECT</h3>
        <div>
          <h2>Impair Senses: 9 / 6 / 3</h2>
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

        <br />
        <textarea onChange={(e) => setDesc(e.target.value)}>{desc}</textarea>
      </div>
      <h1>TTT:{TTT}</h1>
    </>
  );
};

export default InducedIllusion;
