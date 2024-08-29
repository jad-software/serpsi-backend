import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { EntityBase } from "src/entity-base/entities/entity-base";

export class CreateRoleDto extends EntityBase {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}