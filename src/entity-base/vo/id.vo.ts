import { PrimaryGeneratedColumn } from "typeorm";

export class Id {
    @PrimaryGeneratedColumn('uuid')
    private id: string;

    constructor(id: string){
        this.id = id;
    }

    public equals(id: Id): boolean {
        return this.id === id.id;
    }

    public getId(): string {
        return this.id;
    }

}
