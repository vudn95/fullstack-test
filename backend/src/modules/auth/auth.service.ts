import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto, LoginUserDto } from '../users/dto/users.dto';
import { JwtService } from '@nestjs/jwt';
import { Users } from '../database/entities/users.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userServices: UsersService,
    private readonly jwtService: JwtService) {

  }

  async signup(signUpDto: CreateUserDto) {
    const resp = await this.userServices.create(signUpDto);
    const { accessToken } = await this.generateTokens({
      id: resp.user.id,
      email: resp.user.email,
    });
    return {
      accessToken: accessToken,
      user: resp.user,
    };
  }


  async signIn(signInDto: LoginUserDto) {
    if (!signInDto.email || !signInDto.password) {
      throw new BadRequestException("Invalid email or password");
    }
    const userModel = await this.userServices.getByEmail(signInDto.email);
    if (!userModel) {
      throw new BadRequestException("Invalid email or password");
    }
    const passwordValid = await this.userServices.comparePassword(
      signInDto.password,
      userModel.password,
    );

    if (!passwordValid) {
      throw new BadRequestException("Invalid email or password");
    }

    return this.generateTokens({
      id: userModel.id,
      email: userModel.email,
    });
  }

  async getMyProfile(userId): Promise<Users> {
    const userModel = await this.userServices.findOne(userId)
    return userModel;
  }

  generateTokens(payload: {
    id: string;
    email: string;
  }) {
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }


}
