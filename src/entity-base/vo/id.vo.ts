import { PrimaryGeneratedColumn } from "typeorm";

export class Id {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    public equals(id: Id): boolean {
        return this.id === id.id;
    }
}
