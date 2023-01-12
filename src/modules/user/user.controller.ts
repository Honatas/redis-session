import { Body, Controller, HttpCode, Post, Session } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/security/roles.decorator';
import { Role } from 'src/security/roles.enum';
import { AssignRequest } from './request/assign.request';
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
  @ApiOperation({ summary: 'Performs a login for the supplied user' })
  async login(
    @Body() request: LoginRequest,
    @Session() session: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    session.user = await this.userService.login(request);
    return {};
  }

  @Post('/assign')
  @Roles(Role.ASSIGN_USERS)
  @HttpCode(200)
  @ApiOperation({ summary: 'Assigns a user to an access group' })
  async assign(@Body() request: AssignRequest): Promise<Record<string, unknown>> {
    await this.userService.assign(request);
    return {};
  }
}
