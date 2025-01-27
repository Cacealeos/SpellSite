import React, { useState } from "react";
import { Spell } from "./models/Spell";

export default function Home() {
  const style = {
    backGround: "lightGreen",
    margin: "10%",
  };

  const [spell, setSpell] = useState(new Spell());

  function PlyingArts() {
    return (
      <div className="Enchanting" style={style}>
        <h1>Enchanting</h1>
      </div>
    );
  }
}
