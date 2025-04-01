import { EntityBase } from 'src/entity-base/entities/entity-base';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Token extends EntityBase {
  constructor(partial: Partial<Token>) {
    super();
    Object.assign(this, partial);
  }
  @Column({ name: 'token', type: 'varchar', length: 100 })
  private _token: string;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn()
  user: User;

  @Column({
    name: 'expiredAt',
    type: 'timestamptz',
    default: () => "(CURRENT_TIMESTAMP + INTERVAL '1 hour')",
  })
  expiredAt: Date;

  get token(): string {
    return this._token;
  }

  set token(token: string) {
    this._token = token;
  }
}
