import { Action } from "./Action";
import { Potency } from "./Potency";
import { Mastery } from "./Mastery";

export class Spell {
  constructor(
    public base: number = 0,
    public cost: number = 0,
    public school: string = "none",
    public branch: string = "none",
    public action: Action = new Action(),
    public requirement: number = 0,
    public potency: Potency = new Potency(),
    public mastery: Mastery = new Mastery(),
    public demon: boolean = false
  ) {}
}
