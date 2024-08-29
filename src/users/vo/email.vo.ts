import { Column } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

export class Email {
  @Column({
    unique: true,
  })
  private email: string;

  constructor(email: string) {
    this.email = email;
  }

  public getEmail(): string {
    return this.email;
  }

}
