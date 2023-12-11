import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginError400 } from './dto/error-login.dto';
import { LoginDto, LoginResponse } from './dto/login-dto';

@ApiTags('login')
@Controller('login')
export class AuthController {
  constructor(private readonly loginService: AuthService) {}

  @Post()
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({
    status: 400,
    type: LoginError400,
  })
  @HttpCode(200)
  async create(@Body() data: LoginDto): Promise<LoginResponse> {
    return await this.loginService.login(data);
  }
}
