import { Column } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

export class Email {
  @Column({
    unique: true,
    name: 'email'
  })
  private _email: string;

  constructor(email: string) {
    this._email = email;
  }

  get Email(): string {
    return this._email;
  }

}
