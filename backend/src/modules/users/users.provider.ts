import { DataSource } from 'typeorm';
import { Users } from '../database/entities/users.entity';

export const usersProviders = [
  {
    provide: 'USER_REPOSITORY',
    useFactory: (dataSource: DataSource) =>  {
      return dataSource.getRepository(Users)
    },
    inject: ['DATA_SOURCE'],
  },
];