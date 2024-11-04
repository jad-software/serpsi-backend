import { EntityBase } from "src/entity-base/entities/entity-base";
import { IMeetings } from "../intefaces/meetings.interface";
import { Entity } from "typeorm";

@Entity()
export class Meeting extends EntityBase implements IMeetings {
  
}
