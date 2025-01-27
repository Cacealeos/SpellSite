export class Action {
  constructor(private type: string = "MAIN") {}

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
