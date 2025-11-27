export class Action {
  private type: string = "MAIN";

  constructor() {}

  public getType() {
    return this.type;
  }

  public main() {
    this.type = "MAIN";
  }

  public interact() {
    this.type = "INTERACT";
  }
  public defense() {
    this.type = "DEFENSIVE";
  }
}
