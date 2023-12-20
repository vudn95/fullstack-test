import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { usersProviders } from './users.provider';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports:[
    DatabaseModule
  ],
  providers: [
    UsersService,
    ...usersProviders,
    // {
    //   provide: 'USER_REPOSITORY',
    //   useClass: Repository<User>,
    // },
  ],
})
export class UsersModule {}
