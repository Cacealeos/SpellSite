export class Potency {
  constructor(private type: string = "MINOR") {}

  public minor() {
    this.type = "MINOR";
  }
  public major() {
    this.type = "MAJOR";
  }
  public extreme() {
    this.type = "EXTREME";
  }
  public cataclysmic() {
    this.type = "CATACLYSMIC";
  }
}
