import React, { useState } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models/Potency";

const GatherResonance = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState(0);
  const [pot, setPot] = useState(new Potency());
  const [DetectLF, setDetectLF] = useState(false);
  const [DetectNF, setDetectNF] = useState(false);
  const [DetectC, setDetectC] = useState(false);

  let SpellPotency: Potency = new Potency();
  let testPotency: Potency = new Potency();
  let testMastery: Mastery = new Mastery();

  if (!active) setCost(0);

  function calculateCost(cost: number) {
    if (DetectLF) cost *= 1.5;
    if (DetectNF) cost *= 1.5;
    if (DetectC) cost *= 2;

    setCost(cost);
  }

  const changeChoice = (potency: string | void) => {
    if (ParentMastery.getType() === testMastery.novice(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) calculateCost(20);
      if (SpellPotency.getType() === testPotency.major(true)) calculateCost(50);
      if (SpellPotency.getType() === testPotency.extreme(true))
        calculateCost(100);
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.intermediate(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) calculateCost(10);
      if (SpellPotency.getType() === testPotency.major(true)) calculateCost(40);
      if (SpellPotency.getType() === testPotency.extreme(true))
        calculateCost(80);
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.mastered(true)) {
      if (SpellPotency.getType() === testPotency.minor(true)) calculateCost(0);
      if (SpellPotency.getType() === testPotency.major(true)) calculateCost(30);
      if (SpellPotency.getType() === testPotency.extreme(true))
        calculateCost(60);
      setPot(SpellPotency);
    }
  };

  return (
    <>
      <div>
        <h1>Gather Resonance</h1>
        <br />
        <p>Potency</p>
        <div>
          <span>Detect Life-Force: Cost + 50%</span>
          <input type="checkbox" onChange={() => setDetectLF(!DetectLF)} />
          <span>Detect Necro-Force: Cost + 50%</span>
          <input type="checkbox" onChange={() => setDetectNF(!DetectNF)} />
          <span>Detect Chaotic Energy: Cost + 100%</span>
          <input type="checkbox" onChange={() => setDetectC(!DetectC)} />
        </div>
        <div>
          <p>Minor – 20 / 10 / 0</p>
          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.minor())}
          />
        </div>
        <div>
          <p>Major – 50 / 40 / 30</p>
          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.major())}
          />
        </div>
        <div>
          <p>Extreme – 100 / 80 / 60</p>
          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.extreme())}
          />
        </div>
        <br />
        <p>
          Info: Parse out any latent manna signature in the area being broadcast
          as High magic or as transmissions between Magi-Tech.
        </p>
        <p>
          Can be used pre-emptively or after sensing manna signature. Isolating
          source of manna is determined by strength of signal being received,
          integrity of the signal, and uses an Int Check
        </p>
        <p>
          Potency scales with parsing ability, precision in locating source, and
          detection of multiple signals through noise. Int Check is used to
          parse scrambled signatures.
        </p>
      </div>
    </>
  );
};

export default GatherResonance;
