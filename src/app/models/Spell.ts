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
    public action: Action = new Action(action.main()),
    public potency: Potency = new Potency(),
    public mastery: Mastery = new Mastery(),
    public demon: boolean = false,
    public compound: boolean = false
  ) {}
}
