export interface IActionCode {
  id?: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ActionCode implements IActionCode {
  constructor(
    public name: string,
    public description: string = "",
    public isActive: boolean = true,
    public id?: number,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}

  toJSON(): IActionCode {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
