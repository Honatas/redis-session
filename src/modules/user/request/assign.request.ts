import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class AssignRequest {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsArray()
  groupIds: number[];
}
