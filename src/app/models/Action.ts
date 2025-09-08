export class Action {
  private type: string = "MAIN";

  constructor(type: void) {}

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
