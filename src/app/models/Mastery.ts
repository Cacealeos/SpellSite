export class Mastery {
  public type: string = "NOVICE";

  constructor(type: string) {}

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
