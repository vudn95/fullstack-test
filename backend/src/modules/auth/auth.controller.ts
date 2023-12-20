import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from '../users/dto/users.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/core/guards/jwt.guard';

@ApiTags("auth")
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signup(@Body() signupInput: CreateUserDto) {
    return this.authService.signup(signupInput);
  }

  @Post('/signin')
  signIn(@Body() signInInput: LoginUserDto) {
    return this.authService.signIn(signInInput);
  }


  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('/my-profie')
  getMyProfile(@Request() req: Request) {
    const resp = this.authService.getMyProfile(req["user"].id);
    return resp;
  }
}
