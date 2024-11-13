import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateMeetingDto } from './create-meeting.dto';
import { StatusType } from 'src/meetings/domain/vo/statustype.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateStatusDto {
  @ApiProperty({
    type: StatusType,
    enum: StatusType,
    description: 'Status da sessão',
    example: StatusType.CONFIRMED,
  })
  @IsNotEmpty()
  @IsEnum(StatusType)
  status: StatusType
}
