import React, { useState } from "react";
import { Spell } from "../../models/Spell";
import Select from "../../Select";
import { Potency } from "../../models/Potency";
import { Mastery } from "../../models/Mastery";

export default function Enchanting() {
  const [spell, setSpell] = useState(new Spell());

  const style = {
    backGround: "lightGreen",
    margin: "10%",
  };

  const branches = [
    "Weapon Enchantment",
    "Armor Enchantment",
    "Object Enchantment",
    "Shepard",
  ];

  const potency = ["MINOR", "MAJOR", "EXTREME", "CATACLYSMIC"];

  const mastery = ["NOVICE", "INTERMEDIATE", "MASTERED"];

  const spellType = [""];
  let testMastery: Mastery = new Mastery();
  let testPotency: Potency = new Potency();

  function changeBranch(change: string) {
    let spellAlt = spell;
    spellAlt.branch = change;
    setSpell(spellAlt);
  }

  function changePotency(change: string) {
    let spellAlt = spell;
    spellAlt.potency = new Potency();
    if (change == testPotency.minor()) spellAlt.potency.minor();
    else if (change == testPotency.major()) spellAlt.potency.major();
    else if (change == testPotency.extreme()) spellAlt.potency.extreme();
    else if (change == testPotency.cataclysmic())
      spellAlt.potency.cataclysmic();

    setSpell(spellAlt);
  }

  function changeMastery(change: string) {
    let spellAlt = spell;
    spellAlt.potency = new Potency();
    if (change == testMastery.novice()) spellAlt.mastery.novice();
    else if (change == testMastery.intermediate())
      spellAlt.mastery.intermediate();
    else if (change == testMastery.mastered()) spellAlt.mastery.mastered();

    setSpell(spellAlt);
  }

  let base = 0;
  let cost = 0;

  return (
    <>
      <Select
        choices={branches}
        changeChoice={changeBranch}
        title="Branch"
      ></Select>
      <Select
        choices={potency}
        changeChoice={changePotency}
        title="Potency"
      ></Select>
      <Select
        choices={mastery}
        changeChoice={changeMastery}
        title="Mastery"
      ></Select>

      {spell.branch === branches[0] && (
        <div>
          <h1>Manna to Damage</h1>
          <br />
          <input type="number" max="255" min="0" step="1" />
          <br />
          <h4>Maximum damage can go no higher than BASE x 2 of melee weapon</h4>
        </div>
      )}
    </>
  );
}
