export class Mastery {
  private type: string = "NOVICE";

  constructor(type: void) {}

  public getType() {
    return this.type;
  }
  public novice(returnType: boolean = false): string | void {
    this.type = "NOVICE";
    if (returnType) return this.type;
  }
  public intermediate(returnType: boolean = false): string | void {
    this.type = "INTERMEDIATE";
    if (returnType) return this.type;
  }
  public mastered(returnType: boolean = false): string | void {
    this.type = "MASTERED";
    if (returnType) return this.type;
  }
}
