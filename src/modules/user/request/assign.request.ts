import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class AssignRequest {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'User Id', example: 1 })
  userId: number;

  @IsArray()
  @ApiProperty({ description: 'Array of Group Ids', example: [1, 2, 3] })
  groupIds: number[];
}
