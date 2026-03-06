import React, { useState, useEffect } from "react";
import { Mastery } from "../../../models/Mastery";

const DrainAvatar = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [spirit, setSpirit] = useState(0);
  const [soul, setSoul] = useState(0);
  const [life, setLife] = useState(0);

  let testMastery: Mastery = new Mastery();
  let TTT: number[] = [0, 0, 0];

  useEffect(() => {
    if (!active) setSpirit(0);
    setSoul(0);
    setLife(0);
  }, [active]);

  if (ParentMastery.getType() === testMastery.novice(true)) {
    TTT = [10, 5, 6];
  }
  if (ParentMastery.getType() === testMastery.intermediate(true)) {
    TTT = [8, 4, 3];
  }
  if (ParentMastery.getType() === testMastery.mastered(true)) {
    TTT = [6, 3, 2];
  }

  return (
    <>
      <div>
        <h1>Imbue Polymorphic</h1>
        <h3>DIRECT DAMAGE</h3>

        <h3>RANGE - DIRECT</h3>

        <h4>Manna to Spirit Damage: 5 / 4 / 3</h4>
        <input
          type="number"
          min="0"
          value={spirit}
          onChange={(e) => setSpirit(Number(e.target.value))}
        />
        <br />
        <h4>Manna to Soul Damage: 10 / 8 / 6</h4>
        <input
          type="number"
          min="0"
          value={soul}
          onChange={(e) => setSoul(Number(e.target.value))}
        />
        <br />
        <h4>Manna to Life Force Damage: 6 / 4 / 2</h4>
        <input
          type="number"
          min="0"
          value={life}
          onChange={(e) => setLife(Number(e.target.value))}
        />
        <br />
      </div>
      <h1>TTT:{TTT[0] * soul + TTT[1] * spirit + TTT[2] * life}</h1>
      <h2>Damage-- </h2>
      <h4>Life Force: {life}</h4>
      <h4>Spirit: {spirit}</h4>
      <h4>Soul: {soul}</h4>
    </>
  );
};

export default DrainAvatar;
