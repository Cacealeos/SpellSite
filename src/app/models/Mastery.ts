export class Mastery {
  constructor(private type: string = "NOVICE") {}

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
