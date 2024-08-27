import {
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Id } from './id.vo';

export abstract class EntityBase {
    @PrimaryGeneratedColumn('uuid')
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
function TypeormType(arg0: () => typeof Id): (target: EntityBase, propertyKey: "id") => void {
    throw new Error('Function not implemented.');
}

