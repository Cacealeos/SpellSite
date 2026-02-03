import React, { useState, useEffect } from "react";
import { Mastery } from "@/app/models";
import { Potency } from "@/app/models/Potency";

const ImprisionEntity = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState(0);
  const [TTT, setTTT] = useState(0);
  const [power, setPower] = useState(0);
  const [pot, setPot] = useState(new Potency());

  let SpellPotency: Potency = new Potency();
  let testPotency: Potency = new Potency();
  let testMastery: Mastery = new Mastery();
  let TTTrate = 0;

  if (ParentMastery.getType() == testMastery.novice()) TTTrate = 5;
  if (ParentMastery.getType() == testMastery.intermediate()) TTTrate = 3;
  if (ParentMastery.getType() == testMastery.mastered()) TTTrate = 1;

  useEffect(() => {
    if (!active) setCost(0);
  }, [active]);

  const changeChoice = (potency: string | void) => {
    if (ParentMastery.getType() === testMastery.novice(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) {
        setCost(60);
        setPower(1);
      }
      if (SpellPotency.getType() === testPotency.major(true)) {
        setCost(120);
        setPower(1);
      }
      if (SpellPotency.getType() === testPotency.extreme(true)) {
        setCost(240);
        setPower(1);
      }
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.intermediate(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) {
        setCost(50);
        setPower(1);
      }
      if (SpellPotency.getType() === testPotency.major(true)) {
        setCost(100);
        setPower(1);
      }
      if (SpellPotency.getType() === testPotency.extreme(true)) {
        setCost(200);
        setPower(1);
      }
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.mastered(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) {
        setCost(40);
        setPower(1);
      }
      if (SpellPotency.getType() === testPotency.major(true)) {
        setCost(80);
        setPower(1);
      }
      if (SpellPotency.getType() === testPotency.extreme(true)) {
        setCost(160);
        setPower(1);
      }
      setPot(SpellPotency);
    }
  };

  return (
    <>
      <div>
        <h1>Imprision Entity</h1>
        <br />
        <div>
          <span>TTT to PPP</span>
          <br />
          <span> 6 / 4 / 2</span>
          <br />
          <input
            type="number"
            min="0"
            max="13"
            step="1"
            value={power}
            onChange={(e) => setTTT(Number(e.target.value) * TTTrate)}
          />
        </div>
        <span>Potency</span>
        <div>
          <p>Minor – 60 / 50 / 40</p>
          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.minor())}
          />
        </div>
        <div>
          <p>Major – 120 / 100 / 80</p>
          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.major())}
          />
        </div>
        <div>
          <p>Extreme – 240 / 200 / 160</p>
          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.extreme())}
          />
        </div>
        <br />
      </div>
    </>
  );
};

export default ImprisionEntity;
