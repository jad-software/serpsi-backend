import {
    Column,
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Id } from '../vo/id.vo';

export abstract class EntityBase {
    @Column(() => Id)
    private id: Id;

    @CreateDateColumn()
    private createDate: Date;

    @UpdateDateColumn()
    private updateDate: Date;

    public getId(): string {
        return this.id.getId();
    }

    public getCreateDate(): Date {
        return this.createDate;
    }

    public getUpdateDate(): Date {
        return this.updateDate;
    }
}