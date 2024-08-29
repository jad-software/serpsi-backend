import { BadRequestException } from "@nestjs/common";
import { Column } from "typeorm";


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
