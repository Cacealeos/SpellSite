import { Action } from "./Action";
import { Potency } from "./Potency";
import { Mastery } from "./Mastery";

export class Spell {
  constructor(
    public base: number = 0,
    public cost: number = 0,
    public requirement: number = 0,
    public school: string = "none",
    public branch: string = "none",
    public root: string = "none",
    public action: Action = new Action("MAIN"),
    public potency: Potency = new Potency("MINOR"),
    public mastery: Mastery = new Mastery("NOVICE"),
    public demon: boolean = false,
    public compound: boolean = false
  ) {}
}
