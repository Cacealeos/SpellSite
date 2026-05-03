import React, { useState, useEffect } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models/Potency";

const AugmentDimensional = ({
  ParentMastery,
  active,
}: {
  ParentMastery: Mastery;
  active: boolean;
}) => {
  const [cost, setCost] = useState({
    base: 0,
    Power: 0,
    AOE: 0,
    Charge: 0,
    Cost: 0,
    Mod: 0,
    Damage: 0,
  });
  const [pot, setPot] = useState(new Potency());
  const [increments, setIncrement] = useState(0);

  let AOE = ["SMALL", "MODERATE", "LARGE", "MASSIVE"];
  let SpellPotency: Potency = new Potency();
  let testPotency: Potency = new Potency();
  let testMastery: Mastery = new Mastery();

  useEffect(() => {
    if (!active)
      setCost({
        base: 0,
        Power: 0,
        AOE: 0,
        Charge: 0,
        Cost: 0,
        Mod: 0,
        Damage: 0,
      });
  }, [active]);

  const changeChoice = (potency: string | void) => {
    if (ParentMastery.getType() === testMastery.novice(true)) {
      if (SpellPotency.getType() === testPotency.extreme(true))
        setCost({
          base: 215,
          Power: 8,
          AOE: 2,
          Charge: 8,
          Cost: 510,
          Mod: 110,
          Damage: 30,
        });
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.intermediate(true)) {
      if (SpellPotency.getType() === testPotency.extreme(true))
        setCost({
          base: 260,
          Power: 8,
          AOE: 2,
          Charge: 8,
          Cost: 430,
          Mod: 90,
          Damage: 25,
        });
      setPot(SpellPotency);
    }
    if (ParentMastery.getType() === testMastery.mastered(true)) {
      if (SpellPotency.getType() === testPotency.extreme(true))
        setCost({
          base: 260,
          Power: 8,
          AOE: 2,
          Charge: 8,
          Cost: 350,
          Mod: 80,
          Damage: 25,
        });
      setPot(SpellPotency);
    }
  };

  return (
    <>
      <div>
        <h1>Augment Dimensional</h1>
        <br />

        <div>
          <h2>510 / 430 / 350</h2>
          <h3>Base: 260</h3>
          <h3>Power: 8</h3>
          <h3>AOE: LARGE</h3>
          <h3>Charge: 8</h3>
          <h3>Damage Mod: +30</h3>
          <br />

          <input
            type="checkbox"
            onChange={(e) => changeChoice(SpellPotency.extreme())}
          />
        </div>
        <br />
        <div>
          <input
            type="number"
            step="1"
            min="0"
            max="3"
            value={increments}
            onChange={(e) => setIncrement(Number(e.target.value))}
          />
        </div>
        <br />
        <div>
          <span>Base: {cost.base + cost.Damage * increments}</span>
          <br />
          <span>Scaling: 0% / 0%</span>
          <br />
          <span>Power: {cost.Power + increments > 1 ? 1 : 0}</span>
          <br />
          <span>AOE: {increments > 1 ? AOE[cost.AOE + 1] : AOE[cost.AOE]}</span>
          <br />
          <span>Charge Time: {cost.Charge + increments > 1 ? 1 : 0}</span>
          <br />
          <span>DIMENSIONAL DAMAGE</span>
          <br />
          <span>RANGE - RADIAL</span>
          <br />
          <span>COST: {cost.Cost + cost.Mod * increments}</span>
          <br />
        </div>
      </div>
    </>
  );
};

export default AugmentDimensional;

// import React, { useState, useEffect } from "react";
// import { Mastery } from "../../../models/Mastery";
// import { Potency } from "@/app/models/Potency";
// import { Spell } from "@/app/models/Spell";

// const AugmentDimensional = ({
//   ParentMastery,
//   active,
//   setSpell,
// }: {
//   ParentMastery: Mastery;
//   active: boolean;
//   setSpell: React.Dispatch<React.SetStateAction<Spell>>;
// }) => {
//   const [cost, setCost] = useState({
//     base: 0,
//     Power: 0,
//     AOE: 0,
//     Charge: 0,
//     Cost: 0,
//     Mod: 0,
//     Damage: 0,
//   });

//   const [pot, setPot] = useState(new Potency());
//   const [increments, setIncrement] = useState(0);

//   const AOE = ["SMALL", "MODERATE", "LARGE", "MASSIVE"];

//   const testPotency = new Potency();
//   const testMastery = new Mastery();

//   useEffect(() => {
//     if (!active) {
//       setCost({
//         base: 0,
//         Power: 0,
//         AOE: 0,
//         Charge: 0,
//         Cost: 0,
//         Mod: 0,
//         Damage: 0,
//       });

//       setSpell((prev) => ({
//         ...prev,
//         base: 0,
//         cost: 0,
//         potency: new Potency(),
//       }));
//     }
//   }, [active, setSpell]);

//   const changeChoice = () => {
//     const SpellPotency = new Potency();
//     SpellPotency.extreme();

//     let selectedCost;

//     if (ParentMastery.getType() === testMastery.novice(true)) {
//       selectedCost = {
//         base: 215,
//         Power: 8,
//         AOE: 2,
//         Charge: 8,
//         Cost: 510,
//         Mod: 110,
//         Damage: 30,
//       };
//     } else if (ParentMastery.getType() === testMastery.intermediate(true)) {
//       selectedCost = {
//         base: 260,
//         Power: 8,
//         AOE: 2,
//         Charge: 8,
//         Cost: 430,
//         Mod: 90,
//         Damage: 25,
//       };
//     } else {
//       selectedCost = {
//         base: 260,
//         Power: 8,
//         AOE: 2,
//         Charge: 8,
//         Cost: 350,
//         Mod: 80,
//         Damage: 25,
//       };
//     }

//     setCost(selectedCost);
//     setPot(SpellPotency);

//     setSpell((prev) => ({
//       ...prev,
//       root: "Augment Dimensional",
//       base: selectedCost.base,
//       cost: selectedCost.Cost,
//       potency: SpellPotency,
//       mastery: ParentMastery,
//       requirement: selectedCost.Power,
//       compound: false,
//       demon: false,
//     }));
//   };

//   useEffect(() => {
//     setSpell((prev) => ({
//       ...prev,
//       base: cost.base + cost.Damage * increments,
//       cost: cost.Cost + cost.Mod * increments,
//       requirement: cost.Power + (increments > 1 ? 1 : 0),
//     }));
//   }, [increments, cost, setSpell]);

//   return (
//     <div>
//       <h1>Augment Dimensional</h1>

//       <div>
//         <h2>510 / 430 / 350</h2>
//         <h3>Base: 260</h3>
//         <h3>Power: 8</h3>
//         <h3>AOE: LARGE</h3>
//         <h3>Charge: 8</h3>
//         <h3>Damage Mod: +30</h3>

//         <input type="checkbox" onChange={changeChoice} />
//       </div>

//       <div>
//         <input
//           type="number"
//           step="1"
//           min="0"
//           max="3"
//           value={increments}
//           onChange={(e) => setIncrement(Number(e.target.value))}
//         />
//       </div>

//       <div>
//         <span>Base: {cost.base + cost.Damage * increments}</span>
//         <br />
//         <span>Scaling: 0% / 0%</span>
//         <br />
//         <span>Power: {cost.Power + (increments > 1 ? 1 : 0)}</span>
//         <br />
//         <span>AOE: {increments > 1 ? AOE[cost.AOE + 1] : AOE[cost.AOE]}</span>
//         <br />
//         <span>Charge Time: {cost.Charge + (increments > 1 ? 1 : 0)}</span>
//         <br />
//         <span>DIMENSIONAL DAMAGE</span>
//         <br />
//         <span>RANGE - RADIAL</span>
//         <br />
//         <span>COST: {cost.Cost + cost.Mod * increments}</span>
//       </div>
//     </div>
//   );
// };

// export default AugmentDimensional;
