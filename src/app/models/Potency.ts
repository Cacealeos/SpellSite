export class Potency {
  private type: string = "MINOR";

  constructor(type: void) {}

  public getType() {
    return this.type;
  }
  public minor(returnType: boolean = false): string | void {
    this.type = "MINOR";
    if (returnType) return this.type;
  }
  public major(returnType: boolean = false): string | void {
    this.type = "MAJOR";
    if (returnType) return this.type;
  }
  public extreme(returnType: boolean = false): string | void {
    this.type = "EXTREME";
    if (returnType) return this.type;
  }
  public cataclysmic(returnType: boolean = false): string | void {
    this.type = "CATACLYSMIC";
    if (returnType) return this.type;
  }
}
