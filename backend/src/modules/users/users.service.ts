import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { QueryFailedError, Repository } from 'typeorm';
import { Users } from '../database/entities/users.entity';
import { CreateUserDto } from './dto/users.dto';
import * as bcrypt from 'bcrypt';
import { v4 as genUUID } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<Users>,
  ) {}

  async create(signUpDto: CreateUserDto) {
    signUpDto.email = signUpDto.email;
    const hashPassword = await this.hashPassword(signUpDto.password);
    try {
      const user = await this.userRepository.save({
        id: genUUID(),
        email: signUpDto.email,
        password: hashPassword,
        firstName: signUpDto.firstName,
        lastName: signUpDto.lastName,
      });
      user.password = null;
      return {
        user,
      };
    } catch (e) {
      if (e instanceof QueryFailedError) {
        if (e.driverError.code === 'ER_DUP_ENTRY') {
          throw new BadRequestException({
            message: [`email:AlreadyExists`],
          });
        }
      }
      throw e;
    }
  }

  async getByEmail(email: string) {
    const getUser = await this.userRepository.findOne({
      where: {
        email: email,
      },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });
    return getUser;
  }

  async findOne(id: string) {
    const getUser = await this.userRepository.findOne({
      where: {
        id: id,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return getUser;
  }

  async hashPassword(plaintextPassword) {
    const hashStr = await bcrypt.hash(plaintextPassword, 10); // Store hash in the database
    return hashStr;
  }
  // compare password
  async comparePassword(plaintextPassword, hash) {
    const result = await bcrypt.compare(plaintextPassword, hash);
    return result;
  }
}
