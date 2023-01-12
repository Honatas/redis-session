import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginRequest {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: "User's login", example: 'john.doe@email.com' })
  username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: "User's password, unencrypted", example: 'abc123' })
  password: string;
}
