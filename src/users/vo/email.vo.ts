import { Column } from 'typeorm';

export class Email {
  @Column({
    unique: true,
    name: 'email',
  })
  private _email: string;

  constructor(email: string) {
    this._email = email;
  }

  get email(): string {
    return this._email;
  }

  set email(email: string) {
    this._email = email;
  }
}
