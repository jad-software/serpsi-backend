import { BadRequestException } from "@nestjs/common";
import { Column } from "typeorm";


export class Email {
  @Column({
    unique: true,
  })
  private email: string;

  constructor(email: string) {
    if (!this.validate(email)) {
      throw new BadRequestException('Email não validado');
    }
    this.email = email;
  }

  public getEmail(): string {
    return this.email;
  }

  private validate(email: string): boolean {
    let emailRegex = new RegExp('^[a-zA-Z0-9._%±]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$')
    return emailRegex.test(email);
  }
}
