import {
    Column,
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Id } from '../vo/id.vo';

export abstract class EntityBase {
    @Column(() => Id, {prefix: false})
    public id: Id;

    @CreateDateColumn({type: "timestamptz" })
    private createDate: Date;

    @UpdateDateColumn({type: "timestamptz" })
    private updateDate: Date;


    public getCreateDate(): Date {
        return this.createDate;
    }

    public getUpdateDate(): Date {
        return this.updateDate;
    }
}