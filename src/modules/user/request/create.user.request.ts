import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserRequest {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ description: 'user login, must be an email', example: 'john.doe@email.com' })
  username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'user password, unencrypted', example: 'abc123' })
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: "user's full name", example: 'Jonh Doe' })
  fullName: string;
}
