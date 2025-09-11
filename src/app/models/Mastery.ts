export class Mastery {
  private type: string = "NOVICE";

  constructor(type: void) {}

  public getType() {
    return this.type;
  }
  public novice() {
    this.type = "NOVICE";
  }
  public intermediate() {
    this.type = "INTERMEDIATE";
  }
  public mastered() {
    this.type = "MASTERED";
  }
}
