import React, { useState, useEffect } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models/Potency";
import { elements } from "./ConjurationData";

const ConjureElement = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState(0);
  const [pot, setPot] = useState(new Potency());
  const [Element, setElement] = useState<Record<string, {}>>(
    elements["Heat & Cold"]
  );

  let SpellPotency: Potency = new Potency();
  let testPotency: Potency = new Potency();
  let testMastery: Mastery = new Mastery();

  useEffect(() => {
    if (!active) setCost(0);
  }, [active]);

  function calculateCost(cost: number) {
    setCost(cost);
  }

  const changeChoice = (potency: string | void) => {
    if (ParentMastery.getType() === testMastery.novice(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) calculateCost(75);
      if (SpellPotency.getType() === testPotency.major(true))
        calculateCost(105);
      if (SpellPotency.getType() === testPotency.extreme(true))
        calculateCost(135);
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.intermediate(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) calculateCost(50);
      if (SpellPotency.getType() === testPotency.major(true)) calculateCost(70);
      if (SpellPotency.getType() === testPotency.extreme(true))
        calculateCost(90);
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.mastered(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) calculateCost(25);
      if (SpellPotency.getType() === testPotency.major(true)) calculateCost(35);
      if (SpellPotency.getType() === testPotency.extreme(true))
        calculateCost(45);
      setPot(SpellPotency);
    }
  };

  return (
    <>
      <div>
        <h1>Conjure Element</h1>
        <br />
        <p>Elements</p>
        <div>
          <button
            onClick={(e) =>
              setElement({ "Heat & Cold": elements["Heat & Cold"] })
            }
          >
            Heat & Cold
          </button>
          <button
            onClick={(e) =>
              setElement({ "Earth & Water": elements["Earth & Water"] })
            }
          >
            Earth & Water
          </button>
          <button
            onClick={(e) => setElement({ Lightning: elements.Lightning })}
          >
            Lightning
          </button>
          <button onClick={(e) => setElement({ Wind: elements.Wind })}>
            {" "}
            Wind
          </button>
        </div>
        <br />
        <p>Potency</p>
        <div>
          <p>Minor – 75 / 50 / 25</p>
          <br />
          <span>Base: 12</span>
          <br />
          <span>Power: 0</span>
          <br />
          <span>Roll: 6</span>
          <br />
          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.minor())}
          />
        </div>
        <div>
          <p>Major – 105 / 70 / 35</p>
          <br />
          <span>Base: 20</span>
          <br />
          <span>Power: 1</span>
          <br />
          <span>Roll: 10</span>
          <br />
          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.major())}
          />
        </div>
        <div>
          <p>Extreme – 135 / 90 / 45</p>
          <br />
          <span>Base: 28</span>
          <br />
          <span>Power: 2</span>
          <br />
          <span>Roll: 14</span>
          <br />
          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.extreme())}
          />
        </div>
        <br />
        <div>
          <p>{Object.keys(Element)[0]}</p>
        </div>
      </div>
    </>
  );
};

export default ConjureElement;
