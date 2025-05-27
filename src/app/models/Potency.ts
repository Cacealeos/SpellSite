export class Potency {
  private type: string = "MINOR";

  constructor(type: string) {}

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
