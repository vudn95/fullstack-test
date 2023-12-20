import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { Repository } from 'typeorm';
import { Users } from '../database/entities/users.entity';
import { AuthService } from './auth.service';
import { JwtStrategy } from 'src/core/strategy/jwt.stratey';
import { usersProviders } from '../users/users.provider';

@Module({
  controllers: [AuthController],
  providers: [
    ...usersProviders,
    UsersService,
    // {
    //   provide: 'USER_REPOSITORY',
    //   useClass: Repository<Users>,
    // },
    AuthService,
    JwtStrategy,
  ],
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '8000s' },
    }),
  ],
  exports: [PassportModule],
})
export class AuthModule {}
