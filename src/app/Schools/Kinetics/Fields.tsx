import React, { useState, useEffect } from "react";
import { Mastery } from "@/app/models";
import { Potency } from "@/app/models/Potency";

const Fields = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState(0);
  const [TTT, setTTT] = useState(0);
  const [sizeTTT, setSizeTTT] = useState(2);
  const [vitality, setVitality] = useState(0);
  const [power, setPower] = useState(0);
  const [pot, setPot] = useState(new Potency());

  let testMastery: Mastery = new Mastery();

  let PowerRate: number = 0;
  let VitalityRate: number = 0;

  useEffect(() => {
    if (!active) setCost(0);
  }, [active]);

  if (ParentMastery.getType() == testMastery.novice()) {
    PowerRate = 5;
    VitalityRate = 1;
  } else if (ParentMastery.getType() == testMastery.intermediate()) {
    PowerRate = 4;
    VitalityRate = 0.5;
  } else if (ParentMastery.getType() == testMastery.mastered()) {
    PowerRate = 3;
    VitalityRate = 0.25;
  }

  function calcuateVitality(value: number) {
    setVitality(value);
    calcuateTTT();
  }
  function calcuatePower(value: number) {
    setPower(value);
    calcuateTTT();
  }

  function calcuateTTT() {
    setTTT(power * PowerRate + vitality * VitalityRate);
  }

  const changeChoice = (size: number) => {
    if (size === 1) {
      if (ParentMastery.getType() === testMastery.novice(true)) {
        setCost(0);
        setSizeTTT(6);
      } else if (ParentMastery.getType() === testMastery.intermediate(true)) {
        setCost(0);
        setSizeTTT(4);
      } else if (ParentMastery.getType() === testMastery.mastered(true)) {
        setCost(0);
        setSizeTTT(2);
      }
    } else if (size === 2) {
      if (ParentMastery.getType() === testMastery.novice(true)) {
        setCost(45);
        setSizeTTT(12);
      } else if (ParentMastery.getType() === testMastery.intermediate(true)) {
        setCost(35);
        setSizeTTT(10);
      } else if (ParentMastery.getType() === testMastery.mastered(true)) {
        setCost(25);
        setSizeTTT(8);
      }
    } else if (size === 3) {
      if (ParentMastery.getType() === testMastery.novice(true)) {
        setCost(180);
        setSizeTTT(18);
      } else if (ParentMastery.getType() === testMastery.intermediate(true)) {
        setCost(140);
        setSizeTTT(16);
      } else if (ParentMastery.getType() === testMastery.mastered(true)) {
        setCost(100);
        setSizeTTT(14);
      }
    }
  };

  return (
    <>
      <div>
        <h1>Fields</h1>
        <br />
        <div>
          <span>Manna to Endurance</span>
          <br />
          <input
            type="number"
            min="0"
            max="3"
            step="1"
            value={power}
            onChange={(e) => calcuatePower(Number(e.target.value))}
          />

          <span>Manna to Vitality</span>
          <br />
          <input
            type="number"
            min={power * 75}
            step="1"
            value={vitality + power * 10}
            onChange={(e) => calcuateVitality(Number(e.target.value))}
          />
        </div>
        <span>Range</span>
        <div>
          <p>Small AOE</p>
          <input type="checkbox" onChange={(e) => changeChoice(1)} />
        </div>
        <div>
          <p>Moderate AOE</p>
          <input type="checkbox" onChange={(e) => changeChoice(2)} />
        </div>
        <div>
          <p>Large AOE</p>
          <input type="checkbox" onChange={(e) => changeChoice(3)} />
        </div>
        <br />
      </div>
    </>
  );
};

export default Fields;
