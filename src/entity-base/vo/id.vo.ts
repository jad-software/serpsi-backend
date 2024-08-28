import { PrimaryGeneratedColumn } from "typeorm";

export class Id {
    @PrimaryGeneratedColumn('uuid')
    private id: string;

    public getId(): string {
        return this.id;
    }

    public equals(id: Id): boolean {
        return this.id === id.getId();
    }
}
