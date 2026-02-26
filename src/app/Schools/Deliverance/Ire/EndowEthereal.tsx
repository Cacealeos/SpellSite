import React, { useState, useEffect } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models/Potency";

const EndowEthereal = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState(0);
  const [attunement, setAttuenment] = useState(0);
  const [favor, setFavor] = useState(0);
  const [wisdom, setWisdom] = useState(0);
  const [esteem, setEsteem] = useState(0);
  const [usedTotal, setUsedTotal] = useState(0);
  //const [total, setTotal] = useState(0);

  const [base, setBase] = useState(0);
  const [power, setPower] = useState(3);
  const [pScale, setPScale] = useState(0);
  const [nScale, setNScale] = useState(0);
  const [reduction, setReduction] = useState(0);

  let testMastery: Mastery = new Mastery();
  let baseRate: number = 0;
  let powerRate: number = 1;
  let pScaleRate: number = 5;
  let nScaleRate: number = -5;
  let costRate: number = 0;

  let total: number = attunement + favor + wisdom + esteem;

  useEffect(() => {
    if (!active) setCost(0);
  }, [active]);

  if (ParentMastery.getType() === testMastery.novice(true)) {
    baseRate = 10;
    costRate = 1;
  }
  if (ParentMastery.getType() === testMastery.intermediate(true)) {
    baseRate = 15;
    costRate = 3;
  }
  if (ParentMastery.getType() === testMastery.mastered(true)) {
    baseRate = 20;
    costRate = 5;
  }

  function changeBase(value: number) {
    if ((value / baseRate) % ((power - 3) * 2) > 3) return;
    if ((value / baseRate) % (pScale / 5) > 3) return;
    if ((value / baseRate) % (nScale / 5) > 3) return;

    setUsedTotal(total + value / baseRate);
    setBase(value);
  }

  function changePower(value: number) {
    if (((value - 3) * 2) % (base / baseRate) > 3) return;
    if (((value - 3) * 2) % (pScale / 5) > 3) return;
    if (((value - 3) * 2) % (nScale / 5) > 3) return;

    setUsedTotal(total + value / baseRate);
    setPower(value);
  }

  function changeCost(value: number) {
    setReduction(value);
  }

  function changePScaling(value: number) {
    if ((value / 5) % ((power - 3) * 2) > 3) return;
    if ((value / 5) % (base / baseRate) > 3) return;
    if ((value / 5) % (nScale / 5) > 3) return;

    setUsedTotal(total + value / 5);
    setPScale(value);
  }

  function changeNScaling(value: number) {
    if ((value / 5) % ((power - 3) * 2) > 3) return;
    if ((value / 5) % (base / baseRate) > 3) return;
    if ((value / 5) % (pScale / 5) > 3) return;

    setUsedTotal(total + value / 5);
    setNScale(value);
  }

  return (
    <>
      <div>
        <h1>Endow Ethreal</h1>
        <br />
        <h3>LARGE AOE- SELECTIVE</h3>
        <h3>KINETIC - DAMAGE</h3>
        <h3>RANGE - RADIAL</h3>
        <div>
          <div>
            <h2>ATTUNEMENT</h2>
            <input
              min="0"
              value={attunement}
              step="5"
              type="number"
              onChange={(e) => setAttuenment(Number(e.target.value))}
            />
          </div>
          <div>
            <h2>FAVOR</h2> <br />
            <input
              min="0"
              max="20"
              value={favor}
              step="1"
              type="number"
              onChange={(e) => setFavor(Number(e.target.value))}
            />
          </div>
          <div>
            <h2>WISDOM</h2> <br />
            <input
              min="0"
              max="400"
              value={wisdom}
              step="10"
              type="number"
              onChange={(e) => setWisdom(Number(e.target.value))}
            />
          </div>
          <div>
            <h2>ESTEEM</h2> <br />
            <input
              min="0"
              max="12"
              value={esteem}
              step="1"
              type="number"
              onChange={(e) => setEsteem(Number(e.target.value))}
            />
          </div>
        </div>
        <br />
        <div>
          <h2>Base</h2>
          <input
            min="0"
            value={base}
            step={baseRate}
            type="number"
            onChange={(e) => changeBase(Number(e.target.value))}
          />
          <br />
          <h2>Power</h2>
          <input
            min="3"
            value={power}
            step={powerRate}
            type="number"
            onChange={(e) => changePower(Number(e.target.value))}
          />
          <br />
          <h2>Cost Reduction</h2>
          <input
            min="0"
            value={reduction}
            step={costRate}
            type="number"
            onChange={(e) => changeCost(Number(e.target.value))}
          />
          <br />
          <h2>Positive Scaling</h2>
          <input
            min="0"
            max="100"
            value={pScale}
            step={pScaleRate}
            type="number"
            onChange={(e) => changePScaling(Number(e.target.value))}
          />
          <br />
          <h2>Negative Scaling</h2>
          <input
            min="0"
            max="75"
            value={nScale}
            step={nScaleRate}
            type="number"
            onChange={(e) => changeNScaling(Number(e.target.value))}
          />
          <br />
        </div>
      </div>
    </>
  );
};

export default EndowEthereal;
