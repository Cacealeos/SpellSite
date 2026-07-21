import { useState, useEffect } from "react";

import { Mastery, Spell } from "@/app/models";
import Select from "@/app/Select";
import { appliedWeapons } from "./ApplyEffect";

const ApplyEffect = ({
  ParentMastery,
  active,
  updateSpell,
}: {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
}) => {
  const [selectedWeapon, setSelectedWeapon] = useState(0);
  const [baseCost, setBaseCost] = useState(0);

  let cost = 0;
  let ttt = 0;

  switch (ParentMastery.getType()) {
    case "NOVICE":
      cost = Math.ceil(baseCost * 0.7);
      ttt = Math.ceil(baseCost * 0.3);
      break;

    case "INTERMEDIATE":
      cost = Math.ceil(baseCost * 0.5);
      ttt = Math.ceil(baseCost * 0.2);
      break;

    case "MASTERED":
      cost = Math.ceil(baseCost * 0.3);
      ttt = Math.ceil(baseCost * 0.1);
      break;
  }

  /* =========================
     RESET WHEN INACTIVE
  ========================= */

  useEffect(() => {
    if (!active) {
      updateSpell("cost", 0);
      updateSpell("ttt", 0);
    }
  }, [active, updateSpell]);

  /* =========================
     SYNC TO PARENT SPELL
  ========================= */

  useEffect(() => {
    if (!active) {
      updateSpell("cost", 0);
      updateSpell("ttt", 0);
      return;
    }

    updateSpell("cost", cost);
    updateSpell("ttt", ttt);
  }, [active, cost, ttt, updateSpell]);

  return (
    <>
      <div>
        <Select
          title="Applied Weapons"
          choices={appliedWeapons.map((weapon) => weapon.label)}
          changeChoice={(choice: string) =>
            setSelectedWeapon(
              appliedWeapons.findIndex((weapon) => weapon.label === choice),
            )
          }
        />

        <br />

        <h2 className="text-xl font-bold text-orange-400">
          {appliedWeapons[selectedWeapon].label}
        </h2>

        <div className="mt-1 mb-4 h-px bg-gray-600" />

        <div className="space-y-2">
          {appliedWeapons[selectedWeapon].info.map((line, index) => (
            <p key={index} className="text-sm text-gray-400">
              {line}
            </p>
          ))}
        </div>

        <br />

        <h2 className="text-xl font-bold text-orange-400">
          Base Cost of Applied Spell
        </h2>

        <div className="mt-2">
          <input
            type="number"
            min={0}
            max={300}
            step={1}
            value={baseCost}
            onChange={(e) => setBaseCost(Number(e.target.value) || 0)}
            className="w-24 rounded border border-gray-600 bg-gray-800 px-2 py-1 text-center text-gray-100"
          />

          <p className="mt-3 text-sm text-gray-400">
            Cost: <span className="font-medium">70% / 50% / 30%</span>
            <br />
            TTT: <span className="font-medium">30% / 20% / 10%</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default ApplyEffect;
