import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserRequest } from './request/create.user.request';
import { LoginRequest } from './request/login.request';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Creates a new user' })
  async register(@Body() request: CreateUserRequest): Promise<Record<string, unknown>> {
    await this.userService.create(request);
    return {};
  }

  @Post('/login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Performs a login for the supplied user ' })
  async login(@Body() request: LoginRequest): Promise<Record<string, unknown>> {
    await this.userService.login(request);
    return {};
  }
}