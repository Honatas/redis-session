import { IsNotEmpty, IsNumber } from 'class-validator';

export class AssignRequest {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  roleIds: number[];
}
